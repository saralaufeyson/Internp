using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;

var builder = WebApplication.CreateBuilder(args);

// Get MongoDB Connection String from Configuration
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDb");
var mongoClient = new MongoClient(mongoConnectionString);
builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.Name = "YourAppCookie";
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.LoginPath = "/Authentication/Login";
    options.LogoutPath = "/Authentication/Login";
    options.AccessDeniedPath = "/Authentication/error";
});

// Add authentication services
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Authentication/Login";
        options.AccessDeniedPath = "/Authentication/error";
    });

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder
            .WithOrigins("http://localhost:4200") // Replace with your Angular app URL
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MentorPolicy", policy => policy.RequireRole("Mentor"));
    options.AddPolicy("InternPolicy", policy => policy.RequireRole("Intern"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseAuthentication(); // Ensure this line is present
app.UseAuthorization();
app.UseCors("AllowAngularApp");
app.MapControllers(); // Make sure this line maps controllers

app.Run();