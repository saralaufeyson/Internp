using Microsoft.AspNetCore.Mvc;
using InternPortal.Models;
using System.Threading.Tasks;
using InternPortal.Interfaces;

namespace InternPortal.Controllers
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
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                // Ensure passwords are hashed and salted in the repository implementation
                var result = await _userRepository.RegisterUserAsync(user);
                if (result == "User with this email already exists.")
                {
                    return Conflict(result);
                }
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception securely (e.g., using Serilog or NLog)
                // Avoid exposing sensitive details to the client
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                // Ensure secure token generation and validation in the repository
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
            catch (Exception)
            {
                // Log the exception securely
                return StatusCode(500, "An error occurred while processing your request.");
            }
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