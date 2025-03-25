using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using InternPortal.Repositories;
using InternPortal.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var configuration = builder.Configuration;

// Configure MongoDB
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var connectionString = configuration.GetConnectionString("MongoDb");
    return new MongoClient(connectionString);
});

// Register Services
builder.Services.AddScoped<IUserDetailsRepository, UserDetailsRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPocProjectRepository, PocProjectRepository>();
builder.Services.AddScoped<IMentorRepository, MentorRepository>();
builder.Services.AddScoped<ILearningPathRepository, LearningPathRepository>();

// Configure Authentication using JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "DefaultSecretKey")), // Use environment variable for the secret key
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Enable CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy
            .WithOrigins("http://localhost:4200") // Replace with your Angular app URL
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// Configure Middleware Pipeline
app.UseHttpsRedirection();
app.UseHsts(); // Enforce HTTP Strict Transport Security
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

// Add Content Security Policy (CSP) headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none';");
    await next();
});

app.MapControllers();

app.Run();
