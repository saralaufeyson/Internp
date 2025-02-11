using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public AuthController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _usersCollection = database.GetCollection<User>("Users");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var existingUser = await _usersCollection.Find(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return Conflict("User with this email already exists.");
            }

            // Use the role from the request
            user.Role = user.Role ?? "Intern"; // Default role is Intern if not provided

            await _usersCollection.InsertOneAsync(user);
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _usersCollection.Find(u => u.Email == request.Email && u.Password == request.Password).FirstOrDefaultAsync();
            if (existingUser == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(new { Message = "Login successful.", UserId = existingUser.Id, Role = existingUser.Role });
        }

        [HttpGet("role/{userId}")]
        public async Task<IActionResult> GetUserRole(string userId)
        {
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user.Role);
        }
    }
}