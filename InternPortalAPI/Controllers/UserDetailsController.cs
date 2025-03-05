using Microsoft.AspNetCore.Mvc;
using InternPortal.Models;
using InternPortal.Interfaces;

using System.Threading.Tasks;

namespace InternPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDetailsController : ControllerBase
    {
        private readonly IUserDetailsRepository _userDetailsRepository;

        public UserDetailsController(IUserDetailsRepository userDetailsRepository)
        {
            _userDetailsRepository = userDetailsRepository;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserDetails(string userId)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");
            return Ok(userDetails);
        }

        [HttpPost("adddetails")]
        public async Task<IActionResult> CreateUserDetails([FromBody] UserDetails userDetails)
        {
            if (userDetails == null || string.IsNullOrEmpty(userDetails.UserId) || string.IsNullOrEmpty(userDetails.Email))
            {
                return BadRequest("Invalid user details.");
            }

            await _userDetailsRepository.CreateUserDetailsAsync(userDetails);
            return CreatedAtAction(nameof(GetUserDetails), new { userId = userDetails.UserId }, userDetails);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserDetails(string userId, [FromBody] UserDetails userDetails)
        {
            var existingDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (existingDetails == null) return NotFound("User details not found.");

            await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);
            var updatedDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);

            return Ok(updatedDetails);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUserDetails(string userId)
        {
            var existingDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (existingDetails == null) return NotFound("User details not found.");

            await _userDetailsRepository.DeleteUserDetailsAsync(userId);
            return Ok("User details deleted successfully.");
        }

        // Experience Endpoints
        [HttpPost("{userId}/experience")]
        public async Task<IActionResult> AddExperience(string userId, [FromBody] Experience experience)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");

            userDetails.Experiences.Add(experience);
            await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);

            return Ok(userDetails);
        }

        [HttpPut("{userId}/experience/{index}")]
        public async Task<IActionResult> UpdateExperience(string userId, int index, [FromBody] Experience experience)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");
            if (index < 0 || index >= userDetails.Experiences.Count) return BadRequest("Invalid experience index.");

            userDetails.Experiences[index] = experience;
            await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);
            return Ok(userDetails);
        }

        [HttpDelete("{userId}/experience/{index}")]
        public async Task<IActionResult> DeleteExperience(string userId, int index)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");
            if (index < 0 || index >= userDetails.Experiences.Count) return BadRequest("Invalid experience index.");

            userDetails.Experiences.RemoveAt(index);
            await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);
            return Ok(userDetails);
        }

        // Skills Endpoints
        [HttpPost("{userId}/skills")]
        public async Task<IActionResult> AddSkill(string userId, [FromBody] SkillRequest request)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");

            string skill = request.Skill; // Extract skill from request body
            if (string.IsNullOrEmpty(skill)) return BadRequest("Skill cannot be empty.");

            userDetails.Skills.Add(skill);
            await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);

            return Ok("Skill added successfully.");
        }


        [HttpDelete("{userId}/skills/{skill}")]
        public async Task<IActionResult> DeleteSkill(string userId, string skill)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");

            if (userDetails.Skills.Contains(skill))
            {
                userDetails.Skills.Remove(skill);
                await _userDetailsRepository.UpdateUserDetailsAsync(userId, userDetails);
            }

            return Ok(userDetails);
        }
    }
}

public class SkillRequest
{
    public string Skill { get; set; } = string.Empty; // Initialize with a default value
}
