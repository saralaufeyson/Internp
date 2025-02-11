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

            project.CreatedAt = DateTime.UtcNow;
            await _pocProjectCollection.InsertOneAsync(project);
            return Ok(new { message = "PoC Project added successfully." });
        }

        [HttpGet("getPocProjects/{userId}")]
        public async Task<IActionResult> GetPocProjects(string userId)
        {
            var pocProjects = await _pocProjectCollection
                .Find(p => p.UserId == userId)
                .ToListAsync();

            if (pocProjects.Count == 0)
            {
                return NotFound(new { message = "No PoC projects found for this user." });
            }

            return Ok(pocProjects);
        }

        [HttpGet("getLearningPaths")]
        public async Task<IActionResult> GetLearningPaths()
        {
            var learningPaths = await _learningPathCollection.Find(lp => true).ToListAsync();

            if (learningPaths.Count == 0)
            {
                return NotFound(new { message = "No learning paths found." });
            }

            return Ok(learningPaths);
        }

        [HttpPost("addGoal")]
        public async Task<IActionResult> AddGoal([FromBody] Goal goal)
        {
            if (goal == null)
            {
                return BadRequest("Goal data is required.");
            }

            await _goalCollection.InsertOneAsync(goal);
            return Ok(new { message = "Goal added successfully." });
        }

        [HttpGet("getAllGoals")]
        public async Task<IActionResult> GetAllGoals()
        {
            var goals = await _goalCollection.Find(_ => true).ToListAsync();

            if (goals.Count == 0)
            {
                return NotFound(new { message = "No goals found." });
            }

            return Ok(goals);
        }

        [HttpGet("getGoals/{userId}")]
        public async Task<IActionResult> GetGoals(string userId)
        {
            var goals = await _goalCollection.Find(g => g.UserId == userId).ToListAsync();

            if (goals.Count == 0)
            {
                return NotFound(new { message = "No goals found for this user." });
            }

            return Ok(goals);
        }

        [HttpGet("getGoalCount/{userId}")]
        public async Task<IActionResult> GetGoalCount(string userId)
        {
            var goalCount = await _goalCollection.CountDocumentsAsync(g => g.UserId == userId);
            return Ok(new { count = goalCount });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly IMongoCollection<PocProject> _pocProjectCollection;

        public UserController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _userCollection = database.GetCollection<User>("Users");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
        }

        [HttpGet("getUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            if (!ObjectId.TryParse(userId, out var objectId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            var user = await _userCollection.Find(u => u.Id == objectId.ToString()).FirstOrDefaultAsync();

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
            if (user == null)
            {
                return BadRequest(new { message = "User data is required." });
            }

            if (!ObjectId.TryParse(user.Id, out var objectId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

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
            return Ok(interns);
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
    }
}