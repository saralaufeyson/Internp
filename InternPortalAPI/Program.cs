using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using InternPortal.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var configuration = builder.Configuration;

// Configure MongoDB
var mongoConnectionString = configuration.GetConnectionString("MongoDb");
var mongoClient = new MongoClient(mongoConnectionString);
builder.Services.AddSingleton<IMongoClient>(mongoClient);

// Register Services
builder.Services.AddScoped<IUserDetailsRepository, UserDetailsRepository>();  // ✅ Register IUserDetailsRepository
builder.Services.AddScoped<IUserRepository, UserRepository>();
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKey")), // Change this to a secure key
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
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers(); // Ensure controllers are mapped

app.Run();
