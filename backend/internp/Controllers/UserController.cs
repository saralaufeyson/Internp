using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;

using System.Threading.Tasks;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using System.Xml.Linq;
using System.Text.Json;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UserDataController : ControllerBase
    {
        private readonly IMongoCollection<Goal> _goalCollection;
        private readonly IMongoCollection<PocProject> _pocProjectCollection;
        private readonly IMongoCollection<LearningPath> _learningPathCollection;
        private readonly IMongoCollection<User> _userCollection;       
         private readonly IMongoCollection<myLearningPath> _myLearningPathCollection;

        public UserDataController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _goalCollection = database.GetCollection<Goal>("Goals");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
            _learningPathCollection = database.GetCollection<LearningPath>("LearningPaths");
            _userCollection = database.GetCollection<User>("Users");
            _myLearningPathCollection = database.GetCollection<myLearningPath>("myLearningPath");

        }
        // Add a new Learning Path Status
        [HttpPost("addLearningPathStatus")]
        public async Task<IActionResult> AddLearningPathStatus([FromBody] myLearningPath learningPathStatus)
        {
            if (learningPathStatus == null)
            {
            return BadRequest("Learning Path Status data is required.");
            }

            if (string.IsNullOrEmpty(learningPathStatus.UserId) || string.IsNullOrEmpty(learningPathStatus.LearningPathId))
            {
            return BadRequest("UserId and LearningPathId are required.");
            }

            // Set the creation time of the learning path status
            learningPathStatus.CreatedAt = DateTime.UtcNow;

            // Store the learning path status
            await _myLearningPathCollection.InsertOneAsync(learningPathStatus);
            Console.WriteLine($"Learning Path Status added to the database for UserId: {learningPathStatus.UserId}");
            return Ok(new { message = "Learning Path Status added successfully." });
        }

        // Get Learning Path Status for a specific user
        [HttpGet("getLearningPathStatus/{userId}")]
        public async Task<IActionResult> GetLearningPathStatus(string userId)
        {
            Console.WriteLine($"Fetching Learning Path Status for UserId: {userId}");

            var userLearningPathCollection = _learningPathCollection.Database.GetCollection<myLearningPath>("myLearningPath");
            var learningPathStatuses = await userLearningPathCollection
            .Find(lp => lp.UserId == userId)
            .ToListAsync();

            if (learningPathStatuses.Count == 0)
            {
            Console.WriteLine("No Learning Path Status found.");
            return NotFound(new { message = "No Learning Path Status found for this user." });
            }

            Console.WriteLine($"Found {learningPathStatuses.Count} learning path statuses for UserId: {userId}");
            return Ok(learningPathStatuses);
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

            var projects = await _pocProjectCollection
                .Find(p => p.UserId == userId)
                .ToListAsync();

            if (projects.Count == 0)
            {
                Console.WriteLine("No PoC projects found.");
                return NotFound(new { message = "No PoC projects found for this user." });
            }

            var result = projects.Select(p => new
            {
                _id = p.Id.ToString(), // Convert ObjectId to string for frontend usage
                p.UserId,
                p.ProjectName,
                p.Description,
                p.Status,
                p.StartDate,
                p.EndDate,
                p.CreatedAt
            });

            Console.WriteLine($"Found {projects.Count} projects for UserId: {userId}");
            return Ok(result);
        }

        // Delete a PoC Project by ID
        [HttpDelete("deletePocProject/{projectId}")]
        public async Task<IActionResult> DeletePocProject(string projectId)
        {
            Console.WriteLine($"Received delete request for: {projectId}");

            if (!ObjectId.TryParse(projectId, out var objectId))
            {
                return BadRequest(new { message = "Invalid project ID format." });
            }

            var result = await _pocProjectCollection.DeleteOneAsync(p => p.Id == objectId);

            if (result.DeletedCount > 0)
            {
                Console.WriteLine($"PoC Project {projectId} deleted successfully.");
                return Ok(new { message = "PoC project deleted successfully." });
            }

            Console.WriteLine("PoC project not found.");
            return NotFound(new { message = "PoC project not found." });
        }

        // Update PoC Project status and end date
        [HttpPut("updatePocProject/{projectId}")]
        public async Task<IActionResult> UpdatePocProject(string projectId, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(projectId, out var objectId))
            {
                return BadRequest("Invalid project ID format.");
            }

            // Extract EndDate (if present)
            DateTime? endDate = null;
            if (requestBody.TryGetProperty("endDate", out JsonElement endDateElement))
            {
                endDate = endDateElement.ValueKind == JsonValueKind.Null ? (DateTime?)null : endDateElement.GetDateTime();
            }

            // Extract Status (if present)
            string? status = null;
            if (requestBody.TryGetProperty("status", out JsonElement statusElement) && statusElement.ValueKind == JsonValueKind.String)
            {
                status = statusElement.GetString();
            }

            if (endDate == null && status == null)
            {
                return BadRequest("At least one field (endDate or status) must be provided.");
            }

            // Check if the project exists
            var existingProject = await _pocProjectCollection.Find(p => p.Id == objectId).FirstOrDefaultAsync();
            if (existingProject == null)
            {
                return NotFound(new { message = "PoC Project not found." });
            }

            // Build update definition
            var updateDefinition = new List<UpdateDefinition<PocProject>>();
            if (endDate != null)
            {
                updateDefinition.Add(Builders<PocProject>.Update.Set(p => p.EndDate, endDate));
            }
            if (!string.IsNullOrEmpty(status))
            {
                updateDefinition.Add(Builders<PocProject>.Update.Set(p => p.Status, status));
            }

            var update = Builders<PocProject>.Update.Combine(updateDefinition);
            var result = await _pocProjectCollection.UpdateOneAsync(p => p.Id == objectId, update);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return Ok(new { message = "PoC Project updated successfully." });
            }

            return NotFound(new { message = "PoC Project not found or no changes were made." });
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

        [HttpGet("getAllGoals")]
        public async Task<IActionResult> GetAllGoals()
        {
            var goals = await _goalCollection.Find(_ => true).ToListAsync();

            if (goals.Count == 0)
            {
                return NotFound(new { message = "No goals found." });
            }

            var validUserIds = goals
                .Select(g => g.UserId)
                .Where(userId => ObjectId.TryParse(userId, out _))
                .Distinct()
                .ToList();

            var users = await _userCollection.Find(u => validUserIds.Contains(u.Id)).ToListAsync();
            var userDictionary = users
                .Where(u => u.Id != null)
                .ToDictionary(u => u.Id!, u => u.Username);

            var result = goals.Select(g => new
            {
                _id = g.Id.ToString(),
                g.UserId,
                Username = userDictionary.TryGetValue(g.UserId, out var username) ? username : "Unknown",
                g.GoalName,
                g.Description,
                g.CreatedAt
            });

            return Ok(result);
        }

        [HttpDelete("deleteGoal/{goalId}")]
        public async Task<IActionResult> DeleteGoal(string goalId)
        {
            if (!ObjectId.TryParse(goalId, out var objectId))
            {
                return BadRequest(new { message = "Invalid goal ID format." });
            }

            var result = await _goalCollection.DeleteOneAsync(g => g.Id == objectId);

            if (result.DeletedCount > 0)
            {
                return Ok(new { message = "Goal deleted successfully." });
            }

            return NotFound(new { message = "Goal not found." });
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

            // Convert ObjectId to string for frontend usage
            var result = goals.Select(g => new
            {
                _id = g.Id.ToString(), // Convert ObjectId to string
                g.UserId,
                g.GoalName,
                g.Description,
                g.CreatedAt
            });

            // Return the found goals with an OK status
            return Ok(result);
        }

        // Get the count of goals for a specific user
        [HttpGet("getGoalCount/{userId}")]
        public async Task<IActionResult> GetGoalCount(string userId)
        {
            // Count the number of goals for the given userId
            var goalCount = await _goalCollection.CountDocumentsAsync(g => g.UserId == userId);

            // Return the count with an OK status
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
        [HttpGet("getMentors")]
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _userCollection.Find(u => u.Role == "Mentor").ToListAsync();
            if (mentors.Count == 0)
            {
                return NotFound(new { message = "No mentors found." });
            }
            return Ok(mentors); // Return only mentors
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
