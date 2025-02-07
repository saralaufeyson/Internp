using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using YourNamespace.Models;

namespace YourNamespace.Services
{
    public class AuthService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config;

        public AuthService(IMongoClient mongoClient, IConfiguration config)
        {
            var database = mongoClient.GetDatabase("database0"); // Change this
            _users = database.GetCollection<User>("Users");
            _config = config;
        }

        public string GenerateJwtToken(User user)
        {
            var secretKey = _config["Jwt:SecretKey"] ?? throw new ArgumentNullException("Jwt:SecretKey is not configured.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public User GetUserByUsername(string username)
        {
            return _users.Find(u => u.Username == username).FirstOrDefault();
        }

        public void RegisterUser(User user)
        {
            _users.InsertOne(user);
        }
    }
}
