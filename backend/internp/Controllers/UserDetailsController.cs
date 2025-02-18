using Microsoft.AspNetCore.Mvc;
using YourNamespace.Models;
using YourNamespace.Services;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDetailsController : ControllerBase
    {
        private readonly UserDetailsService _userDetailsService;

        public UserDetailsController(UserDetailsService userDetailsService)
        {
            _userDetailsService = userDetailsService;
        }

        // ✅ Get User Details by userId
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserDetails(string userId)
        {
            var userDetails = await _userDetailsService.GetUserDetailsAsync(userId);
            if (userDetails == null) return NotFound("User details not found.");
            return Ok(userDetails);
        }

        // ✅ Create User Details (Add new)
        [HttpPost("adddetails")]
        public async Task<IActionResult> CreateUserDetails([FromBody] UserDetails userDetails)
        {
            await _userDetailsService.CreateUserDetailsAsync(userDetails);
            return CreatedAtAction(nameof(GetUserDetails), new { userId = userDetails.UserId }, userDetails);
        }

        // ✅ Update User Details (Edit)
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserDetails(string userId, [FromBody] UserDetails userDetails)
        {
            var existingDetails = await _userDetailsService.GetUserDetailsAsync(userId);
            if (existingDetails == null) return NotFound("User details not found.");

            // Update the user details using the service
            await _userDetailsService.UpdateUserDetailsAsync(userId, userDetails);

            // Return the updated user details
            var updatedDetails = await _userDetailsService.GetUserDetailsAsync(userId);

            return Ok(updatedDetails); // Return the updated user details in the response
        }

        // ✅ Delete User Details
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUserDetails(string userId)
        {
            var existingDetails = await _userDetailsService.GetUserDetailsAsync(userId);
            if (existingDetails == null) return NotFound("User details not found.");

            await _userDetailsService.DeleteUserDetailsAsync(userId);
            return Ok("User details deleted successfully.");
        }
    }
}
