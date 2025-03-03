using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
using System.Threading.Tasks;
using MongoDB.Bson;
using System.Text.Json;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningPathController : ControllerBase
    {
        private readonly IMongoCollection<LearningPath> _learningPathCollection;
        private readonly IMongoCollection<myLearningPath> _myLearningPathCollection;

        public LearningPathController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _learningPathCollection = database.GetCollection<LearningPath>("LearningPaths");
            _myLearningPathCollection = database.GetCollection<myLearningPath>("myLearningPath");
        }

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
