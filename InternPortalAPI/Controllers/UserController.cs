using Microsoft.AspNetCore.Mvc;
using InternPortal.Models;
using InternPortal.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace InternPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("getUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new
            {
                name = user.Username,
                email = user.Email,
                role = user.Role ?? "No role assigned"
            });
        }

        [HttpPost("updateUserProfile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] User user)
        {
            var result = await _userRepository.UpdateUserAsync(user);
            if (result)
            {
                return Ok(new { message = "User profile updated successfully." });
            }

            return NotFound(new { message = "User not found." });
        }

        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("getInterns")]
        public async Task<IActionResult> GetInterns()
        {
            var interns = await _userRepository.GetUsersByRoleAsync("Intern");
            if (interns.Count == 0)
            {
                return NotFound(new { message = "No interns found." });
            }
            return Ok(interns);
        }

        [HttpGet("getAllInternsCount")]
        public async Task<IActionResult> GetAllInternsCount()
        {
            var internCount = await _userRepository.GetUsersCountByRoleAsync("Intern");
            return Ok(new { count = internCount });
        }

        [HttpGet("getAllMentorsCount")]
        public async Task<IActionResult> GetAllMentorsCount()
        {
            var mentorCount = await _userRepository.GetUsersCountByRoleAsync("Mentor");
            return Ok(new { count = mentorCount });
        }

        [HttpPost("assignInternsToMentor")]
        public async Task<IActionResult> AssignInternsToMentor([FromBody] AssignInternsRequest request)
        {
            if (string.IsNullOrEmpty(request.MentorId))
            {
                return BadRequest(new { message = "MentorId cannot be null or empty." });
            }

            if (request.InternIds == null || request.InternIds.Count == 0)
            {
                return BadRequest(new { message = "InternIds cannot be null or empty." });
            }

            var result = await _userRepository.AssignInternsToMentorAsync(request.MentorId, request.InternIds);
            if (result)
            {
                return Ok(new { message = "Interns assigned to mentor successfully." });
            }

            return BadRequest(new { message = "An error occurred while assigning interns to mentor." });
        }

        [HttpGet("getMentors")]
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _userRepository.GetUsersByRoleAsync("Mentor");
            if (mentors.Count == 0)
            {
                return NotFound(new { message = "No mentors found." });
            }

            return Ok(mentors);
        }

        [HttpGet("getMentorsWithInterns")]
        public async Task<IActionResult> GetMentorsWithInterns()
        {
            var mentorDetails = await _userRepository.GetMentorsWithInternsAsync();
            if (mentorDetails.Count == 0)
            {
                return NotFound(new { message = "No mentors found." });
            }

            return Ok(mentorDetails);
        }

        [HttpGet("getPocProjectStats/{userId}")]
        public async Task<IActionResult> GetPocProjectStats(string userId)
        {
            var stats = await _userRepository.GetPocProjectStatsAsync(userId);
            return Ok(stats);
        }

        [HttpGet("getAllPocProjectStats")]
        public async Task<IActionResult> GetAllPocProjectStats()
        {
            var stats = await _userRepository.GetAllPocProjectStatsAsync();
            return Ok(stats);
        }

        public class AssignInternsRequest
        {
            public string? MentorId { get; set; }
            public List<string>? InternIds { get; set; }
        }

        [HttpPost("uploadImage/{userId}")]
        public async Task<IActionResult> UploadImage(string userId, IFormFile image)
        {
            var result = await _userRepository.UploadImageAsync(userId, image);
            if (result)
            {
                return Ok("Image uploaded successfully.");
            }

            return StatusCode(500, "An error occurred while uploading the image.");
        }

        [HttpGet("getProfileImage/{userId}")]
        public async Task<IActionResult> GetProfileImage(string userId)
        {
            var image = await _userRepository.GetProfileImageAsync(userId);
            if (image == null)
            {
                return NotFound("User or profile image not found.");
            }

            return File(image, "image/jpeg");
        }

        [HttpPost("updateAboutSection/{userId}")]
        public async Task<IActionResult> UpdateAboutSection(string userId, [FromBody] JsonElement requestBody)
        {
            var result = await _userRepository.UpdateAboutSectionAsync(userId, requestBody);
            if (result)
            {
                return Ok(new { message = "About section updated successfully." });
            }

            return NotFound(new { message = "User not found." });
        }

        [HttpGet("getAboutSection/{userId}")]
        public async Task<IActionResult> GetAboutSection(string userId)
        {
            var about = await _userRepository.GetAboutSectionAsync(userId);
            if (about == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new { about });
        }
    }
}