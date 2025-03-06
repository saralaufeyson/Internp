using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using InternPortal.Models;
using System.Threading.Tasks;
using MongoDB.Bson;
using System.Text.Json;

namespace InternPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalController : ControllerBase
    {
        private readonly IMongoCollection<Goal> _goalCollection;
        private readonly IMongoCollection<User> _userCollection;

        public GoalController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _goalCollection = database.GetCollection<Goal>("Goals");
            _userCollection = database.GetCollection<User>("Users");
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
                g.Status,
                g.StartDate,
                g.EndDate,
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
                g.Status,
                g.StartDate,
                g.EndDate,
                g.CreatedAt
            });

            // Return the found goals with an OK status
            return Ok(result);
        }

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

        [HttpPut("updateGoal/{goalId}")]
        public async Task<IActionResult> UpdateGoal(string goalId, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(goalId, out var objectId))
            {
                return BadRequest(new { message = "Invalid goal ID format." });
            }

            var updateDefinition = new UpdateDefinitionBuilder<Goal>();

            var updates = new List<UpdateDefinition<Goal>>();

            if (requestBody.TryGetProperty("status", out var statusElement))
            {
                updates.Add(updateDefinition.Set(g => g.Status, statusElement.GetString()));
            }

            if (requestBody.TryGetProperty("endDate", out var endDateElement) && endDateElement.TryGetDateTime(out var endDate))
            {
                updates.Add(updateDefinition.Set(g => g.EndDate, endDate));
            }

            var update = updateDefinition.Combine(updates);

            var result = await _goalCollection.UpdateOneAsync(g => g.Id == objectId, update);

            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "Goal updated successfully." });
            }

            return NotFound(new { message = "Goal not found or no changes were made." });
        }
    }
}
