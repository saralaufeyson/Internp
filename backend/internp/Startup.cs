using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // Add MongoDB client
        services.AddSingleton<IMongoClient, MongoClient>(sp =>
        {
            var connectionString = Configuration.GetConnectionString("MongoDb");
            return new MongoClient(connectionString);
        });

        // Add authorization services
        // services.AddAuthorization(options =>
        // {
        //     options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
        //     options.AddPolicy("MentorPolicy", policy => policy.RequireRole("Mentor"));
        //     options.AddPolicy("InternPolicy", policy => policy.RequireRole("Intern"));
        // });

        // Add CORS policy
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp",
                builder => builder
                    .WithOrigins("http://localhost:4200") // Replace with your Angular app URL
                    .AllowAnyMethod()
                    .AllowAnyHeader());
        });

        // Add controllers
        services.AddControllers();

        // ...existing code...
    }

    // ...existing code...
}
