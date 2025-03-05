using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using InternPortal.Repositories;
using InternPortal.Interfaces;

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

        services.AddScoped<IPocProjectRepository, PocProjectRepository>();
        services.AddScoped<IUserDetailsRepository, UserDetailsRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IMentorRepository, MentorRepository>();

    }

    // ...existing code...
}
