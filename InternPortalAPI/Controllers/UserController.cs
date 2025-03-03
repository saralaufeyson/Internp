using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
using System.Threading.Tasks;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using System.Xml.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly IMongoCollection<PocProject> _pocProjectCollection;
        private readonly IMongoCollection<UserDetails> _userDetailsCollection;

        public UserController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _userCollection = database.GetCollection<User>("Users");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
            _userDetailsCollection = database.GetCollection<UserDetails>("UserDetails");
        }

        [HttpGet("getUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            // Convert the userId string to MongoDB ObjectId
            if (!ObjectId.TryParse(userId, out var objectId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            // Fetch user profile from the database
            var user = await _userCollection.Find(u => u.Id == objectId.ToString()).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Return the user's username, email, and role
            return Ok(new
            {
                name = user.Username,
                email = user.Email,
                role = user.Role ?? "No role assigned" // Ensure role is included in the response
            });
        }

        [HttpPost("updateUserProfile")]

        public async Task<IActionResult> UpdateUserProfile([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest(new { message = "User data is required." });
            }

            // Check if the user ID is valid
            if (!ObjectId.TryParse(user.Id, out var objectId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            // Update the user's profile in the database
            var result = await _userCollection.ReplaceOneAsync(u => u.Id == objectId.ToString(), user);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return Ok(new { message = "User profile updated successfully." });
            }

            return NotFound(new { message = "User not found." });
        }

        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userCollection.Find(_ => true).ToListAsync();
            return Ok(users);
        }

        [HttpGet("getInterns")]
        public async Task<IActionResult> GetInterns()
        {
            var interns = await _userCollection.Find(u => u.Role == "Intern").ToListAsync();
            if (interns.Count == 0)
            {
                return NotFound(new { message = "No interns found." });
            }
            return Ok(interns); // Return only interns
        }

        [HttpGet("getAllInternsCount")]
        public async Task<IActionResult> GetAllInternsCount()
        {
            var internCount = await _userCollection.CountDocumentsAsync(u => u.Role == "Intern");
            return Ok(new { count = internCount });
        }

        [HttpGet("getAllMentorsCount")]
        public async Task<IActionResult> GetAllMentorsCount()
        {
            var mentorCount = await _userCollection.CountDocumentsAsync(u => u.Role == "Mentor");
            return Ok(new { count = mentorCount });
        }

        [HttpPost("assignInternsToMentor")]
        public async Task<IActionResult> AssignInternsToMentor([FromBody] AssignInternsRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.MentorId) || request.InternIds == null || !request.InternIds.Any())
            {
                return BadRequest(new { message = "MentorId and InternIds are required." });
            }

            var mentor = await _userCollection.Find(u => u.Id == request.MentorId && u.Role == "Mentor").FirstOrDefaultAsync();
            if (mentor == null)
            {
                return NotFound(new { message = "Mentor not found." });
            }

#pragma warning disable CS8604 // Possible null reference argument.
            var interns = await _userCollection.Find(u => request.InternIds.Contains(u.Id) && u.Role == "Intern").ToListAsync();
#pragma warning restore CS8604 // Possible null reference argument.
            if (interns.Count != request.InternIds.Count)
            {
                return BadRequest(new { message = "One or more interns not found." });
            }

            var update = Builders<User>.Update.Set(u => u.AssignedInterns, request.InternIds);
            var result = await _userCollection.UpdateOneAsync(u => u.Id == request.MentorId, update);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return Ok(new { message = "Interns assigned to mentor successfully." });
            }

            return NotFound(new { message = "Mentor not found or no changes were made." });
        }

        [HttpGet("getMentors")]
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _userCollection.Find(u => u.Role == "Mentor").ToListAsync();
            if (mentors.Count == 0)
            {
                return NotFound(new { message = "No mentors found." });
            }

            return Ok(mentors);
        }

        [HttpGet("getMentorsWithInterns")]
        public async Task<IActionResult> GetMentorsWithInterns()
        {
            var mentors = await _userCollection.Find(u => u.Role == "Mentor").ToListAsync();
            if (mentors.Count == 0)
            {
                return NotFound(new { message = "No mentors found." });
            }

            var mentorDetails = new List<object>();

            foreach (var mentor in mentors)
            {
                var internIds = mentor.AssignedInterns ?? new List<string>();
#pragma warning disable CS8604 // Possible null reference argument.
                var interns = await _userCollection.Find(u => internIds.Contains(u.Id)).ToListAsync();
#pragma warning restore CS8604 // Possible null reference argument.

                mentorDetails.Add(new
                {
                    MentorId = mentor.Id,
                    MentorName = mentor.Username,
                    Interns = interns.Select(i => new
                    {
                        InternId = i.Id,
                        InternName = i.Username,
                        InternEmail = i.Email
                    }).ToList()
                });
            }

            return Ok(mentorDetails);
        }

        [HttpGet("getPocProjectStats/{userId}")]
        public async Task<IActionResult> GetPocProjectStats(string userId)
        {
            var totalPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId);
            var inProgressPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId && p.Status == "inProgress");
            var completedPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId && p.Status == "completed");

            return Ok(new
            {
                totalPocs,
                inProgressPocs,
                completedPocs
            });
        }


        [HttpGet("getAllPocProjectStats")]
        public async Task<IActionResult> GetAllPocProjectStats()
        {
            var totalPocs = await _pocProjectCollection.CountDocumentsAsync(_ => true);
            var inProgressPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.Status == "inProgress");
            var completedPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.Status == "completed");

            return Ok(new
            {
                totalPocs,
                inProgressPocs,
                completedPocs
            });
        }
        public class AssignInternsRequest
        {
            public string? MentorId { get; set; }
            public List<string>? InternIds { get; set; }
        }

        [HttpPost("uploadImage/{userId}")]
        public async Task<IActionResult> UploadImage(string userId, IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image file provided.");
            }

            // Check if the file is an image
            if (!image.ContentType.StartsWith("image/"))
            {
                return BadRequest("Only image files are allowed.");
            }

            var user = await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }

            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();

            var update = Builders<User>.Update.Set(u => u.ProfileImage, imageBytes);
            var result = await _userCollection.UpdateOneAsync(u => u.Id == userId, update);

            if (result.ModifiedCount > 0)
            {
                return Ok("Image uploaded successfully.");
            }

            return StatusCode(500, "An error occurred while uploading the image.");
        }

        [HttpGet("getProfileImage/{userId}")]
        public async Task<IActionResult> GetProfileImage(string userId)
        {
            var user = await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null || user.ProfileImage == null)
            {
                return NotFound("User or profile image not found.");
            }

            return File(user.ProfileImage, "image/jpeg"); // Assuming the image is in JPEG format
        }

        [HttpPost("updateAboutSection/{userId}")]
        public async Task<IActionResult> UpdateAboutSection(string userId, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(userId, out var objectId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            if (!requestBody.TryGetProperty("about", out JsonElement aboutElement) || aboutElement.ValueKind != JsonValueKind.String)
            {
                return BadRequest(new { message = "Invalid about section value." });
            }

            var about = aboutElement.GetString();
            var update = Builders<User>.Update.Set(u => u.About, about);
            var result = await _userCollection.UpdateOneAsync(u => u.Id == userId, update);

            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "About section updated successfully." });
            }

            return NotFound(new { message = "User not found." });
        }

        [HttpGet("getAboutSection/{userId}")]
        public async Task<IActionResult> GetAboutSection(string userId)
        {
            var user = await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new { about = user.About });
        }
    }
}