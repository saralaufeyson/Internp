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

            // Fetch the learning path to get subtopics
            var learningPath = await _learningPathCollection.Find(lp => lp.Id == learningPathStatus.LearningPathId).FirstOrDefaultAsync();
            if (learningPath != null)
            {
                learningPathStatus.Subtopics = learningPath.Subtopics;
            }

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

            var result = learningPathStatuses.Select(lp => new
            {
                id = lp.Id.ToString(), // Ensure id is included in the response
                lp.UserId,
                lp.LearningPathId,
                lp.Status,
                lp.Title,
                lp.Description,
                lp.Link,
                lp.CreatedAt,
                lp.Progress,
                lp.Subtopics // Ensure subtopics are included in the response
            });

            Console.WriteLine($"Found {learningPathStatuses.Count} learning path statuses for UserId: {userId}");
            return Ok(result);
        }

        [HttpDelete("deleteLearningPathStatus/{learningPathStatusId}")]
        public async Task<IActionResult> DeleteLearningPathStatus(string learningPathStatusId)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId))
            {
                return BadRequest(new { message = "Invalid learning path status ID format." });
            }

            var result = await _myLearningPathCollection.DeleteOneAsync(lp => lp.Id == objectId);

            if (result.DeletedCount > 0)
            {
                return Ok(new { message = "Learning Path Status deleted successfully." });
            }

            return NotFound(new { message = "Learning Path Status not found." });
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
        // Get all PoC Projects


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

            var result = learningPaths.Select(lp => new
            {
                lp.Id,
                lp.Title,
                lp.Description,
                lp.Link,
                lp.Subtopics
            });

            return Ok(result);  // Return the learning paths as JSON
        }

        [HttpPost("addLearningPath")]
        public async Task<IActionResult> AddLearningPath([FromBody] LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return BadRequest("Learning Path data is required.");
            }

            await _learningPathCollection.InsertOneAsync(learningPath);
            return Ok(new { message = "Learning Path added successfully." });
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

            var users = await _userCollection.Find(u => u.Id != null && validUserIds.Contains(u.Id)).ToListAsync();
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
        // Get the count of all goals

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
        [HttpGet("getAllGoalsCount")]
        public async Task<IActionResult> GetAllGoalsCount()
        {
            var goalCount = await _goalCollection.CountDocumentsAsync(_ => true);
            return Ok(new { count = goalCount });
        }
        [HttpGet("getAllUsersGoalCount")]
        public async Task<IActionResult> GetAllUsersGoalCount()
        {
            var users = await _userCollection.Find(u => u.Role == "Intern").ToListAsync();
            var userGoalCounts = new List<object>();

            foreach (var user in users)
            {
                var goalCount = await _goalCollection.CountDocumentsAsync(g => g.UserId == user.Id);
                userGoalCounts.Add(new
                {
                    UserId = user.Id,
                    Username = user.Username,
                    GoalCount = goalCount
                });
            }

            return Ok(userGoalCounts);
        }

        [HttpPut("updateLearningPathProgress/{learningPathStatusId}")]
        public async Task<IActionResult> UpdateLearningPathProgress(string learningPathStatusId, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId))
            {
                return BadRequest(new { message = "Invalid learning path status ID format." });
            }

            if (!requestBody.TryGetProperty("progress", out JsonElement progressElement) || !progressElement.TryGetDouble(out double progress))
            {
                return BadRequest(new { message = "Invalid progress value." });
            }

            var update = Builders<myLearningPath>.Update.Set(lp => lp.Progress, progress);
            var result = await _myLearningPathCollection.UpdateOneAsync(lp => lp.Id == objectId, update);

            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "Learning path progress updated successfully." });
            }

            return NotFound(new { message = "Learning path status not found." });
        }

        [HttpPut("updateSubtopicStatus/{learningPathStatusId}/{subtopicName}")]
        public async Task<IActionResult> UpdateSubtopicStatus(string learningPathStatusId, string subtopicName, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId))
            {
                return BadRequest(new { message = "Invalid learning path status ID format." });
            }

            if (!requestBody.TryGetProperty("completed", out JsonElement completedElement) ||
                (completedElement.ValueKind != JsonValueKind.True && completedElement.ValueKind != JsonValueKind.False))
            {
                return BadRequest(new { message = "Invalid completed value." });
            }

            var filter = Builders<myLearningPath>.Filter.And(
                Builders<myLearningPath>.Filter.Eq(lp => lp.Id, objectId),
                Builders<myLearningPath>.Filter.ElemMatch(lp => lp.Subtopics, st => st.Name == subtopicName)
            );

            var update = Builders<myLearningPath>.Update.Set("Subtopics.$.Completed", completedElement.GetBoolean());

            var result = await _myLearningPathCollection.UpdateOneAsync(filter, update);

            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "Subtopic status updated successfully." });
            }

            return NotFound(new { message = "Learning path status or subtopic not found." });
        }
    }

}

