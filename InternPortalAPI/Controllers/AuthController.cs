using Microsoft.AspNetCore.Mvc;
using YourNamespace.Models;
using YourNamespace.Repositories;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var result = await _userRepository.RegisterUserAsync(user);
            if (result == "User with this email already exists.")
            {
                return Conflict(result);
            }
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, message, user) = await _userRepository.LoginUserAsync(request);
            if (!success)
            {
                return Unauthorized(message);
            }

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            return Ok(new { Message = message, UserId = user.Id, Role = user.Role, Username = user.Username });
        }

        [HttpGet("role/{userId}")]
        public async Task<IActionResult> GetUserRole(string userId)
        {
            var role = await _userRepository.GetUserRoleAsync(userId);
            if (role == "User not found.")
            {
                return NotFound(role);
            }
            return Ok(role);
        }
    }
}