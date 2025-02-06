using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
using System.Threading.Tasks;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly IMongoCollection<Goal> _goalCollection;
        private readonly IMongoCollection<PocProject> _pocProjectCollection;
        private readonly IMongoCollection<LearningPath> _learningPathCollection;

        public UserDataController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _goalCollection = database.GetCollection<Goal>("Goals");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
            _learningPathCollection = database.GetCollection<LearningPath>("LearningPaths");
        }

        // Add a new PoC Project
        [HttpPost("addPocProject")]
        
        public async Task<IActionResult> AddPocProject([FromBody] PocProject project)
        {
            if (project == null)
            {
                return BadRequest("Project data is required.");
            }

            if (string.IsNullOrEmpty(project.UserId))
            {
                return BadRequest("UserId is required.");
            }

            // Log the received project data
            Console.WriteLine($"Received project data: {project.ProjectName}, {project.Description}, {project.Status}, {project.StartDate}, {project.EndDate}");

            // Set the creation time of the project (if you need it)
            project.CreatedAt = DateTime.UtcNow;

            // Store the PoC project with the user's ID
            await _pocProjectCollection.InsertOneAsync(project);
            Console.WriteLine("PoC Project added to the database.");
            return Ok(new { message = "PoC Project added successfully." });
        }

        // Get PoC Projects for a specific user
        [HttpGet("getPocProjects/{userId}")]
        public async Task<IActionResult> GetPocProjects(string userId)
        {
            Console.WriteLine($"Fetching PoC projects for UserId: {userId}");

            var pocProjects = await _pocProjectCollection
                .Find(p => p.UserId == userId)
                .ToListAsync();

            if (pocProjects.Count == 0)
            {
                Console.WriteLine("No PoC projects found.");
                return NotFound(new { message = "No PoC projects found for this user." });
            }

            Console.WriteLine($"Found {pocProjects.Count} projects for UserId: {userId}");
            return Ok(pocProjects);
        }

        // Add a new Learning Path
        // Inside UserDataController.cs

        [HttpGet("getLearningPaths")]
        public async Task<IActionResult> GetLearningPaths()
        {
            var learningPaths = await _learningPathCollection.Find(lp => true).ToListAsync();

            // If no learning paths are found, return a NotFound status
            if (learningPaths.Count == 0)
            {
                return NotFound(new { message = "No learning paths found." });
            }

            return Ok(learningPaths);  // Return the learning paths as JSON
        }


        [HttpPost("addGoal")]
        
        public async Task<IActionResult> AddGoal([FromBody] Goal goal)
        {
            if (goal == null)
            {
                return BadRequest("Goal data is required.");
            }

            // Store the goal with the user's ID
            await _goalCollection.InsertOneAsync(goal);
            Console.WriteLine("Goal added to the database.");
            return Ok(new { message = "Goal added successfully." });
        }

        // Get goals for a specific user
        [HttpGet("getGoals/{userId}")]
                public async Task<IActionResult> GetGoals(string userId)
        {
            // Retrieve goals for the given userId from the database
            var goals = await _goalCollection.Find(g => g.UserId == userId).ToListAsync();

            // If no goals are found, return a NotFound response with a generic message
            if (goals.Count == 0)
            {
                return NotFound(new { message = "No goals found for this user." });
            }

            // Return the found goals with an OK status
            return Ok(goals);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _userCollection = database.GetCollection<User>("Users");
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
             Console.WriteLine($"Fetched user: {user.Username}, Role: {user.Role}");

            // Return the user's username, email, and role
            return Ok(new
            {
                name = user.Username,
                email = user.Email,
                role = user.Role ?? "No role assigned"// Ensure role is included in the response
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
    }
}