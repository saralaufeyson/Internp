using Microsoft.AspNetCore.Mvc;
using InternPortal.Interfaces;
using InternPortal.Models;
using System.Threading.Tasks;
using System.Text.Json;
using MongoDB.Bson;

namespace InternPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningPathController : ControllerBase
    {
        private readonly ILearningPathRepository _learningPathRepository;

        public LearningPathController(ILearningPathRepository learningPathRepository)
        {
            _learningPathRepository = learningPathRepository;
        }

        [HttpPost("addLearningPathStatus")]
        public async Task<IActionResult> AddLearningPathStatus([FromBody] myLearningPath learningPathStatus)
        {
            if (learningPathStatus == null || string.IsNullOrEmpty(learningPathStatus.UserId) || string.IsNullOrEmpty(learningPathStatus.LearningPathId))
            {
                return BadRequest("Invalid Learning Path Status data.");
            }

            await _learningPathRepository.AddLearningPathStatusAsync(learningPathStatus);
            return Ok(new { message = "Learning Path Status added successfully." });
        }

        [HttpGet("getLearningPathStatus/{userId}")]
        public async Task<IActionResult> GetLearningPathStatus(string userId)
        {
            var learningPathStatuses = await _learningPathRepository.GetLearningPathStatusAsync(userId);
            if (learningPathStatuses == null || !learningPathStatuses.Any())
            {
                return NotFound(new { message = "No Learning Path Status found for this user." });
            }

            var result = learningPathStatuses.Select(lp => new
            {
                id = lp.Id.ToString(),
                lp.UserId,
                lp.LearningPathId,
                lp.Status,
                lp.Title,
                lp.Description,
                lp.Link,
                lp.CreatedAt,
                lp.Progress,
                lp.Subtopics
            });

            return Ok(result);
        }

        [HttpDelete("deleteLearningPathStatus/{learningPathStatusId}")]
        public async Task<IActionResult> DeleteLearningPathStatus(string learningPathStatusId)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId))
            {
                return BadRequest(new { message = "Invalid learning path status ID format." });
            }

            var success = await _learningPathRepository.DeleteLearningPathStatusAsync(learningPathStatusId);
            if (success)
            {
                return Ok(new { message = "Learning Path Status deleted successfully." });
            }

            return NotFound(new { message = "Learning Path Status not found." });
        }

        [HttpGet("getLearningPaths")]
        public async Task<IActionResult> GetLearningPaths()
        {
            var learningPaths = await _learningPathRepository.GetLearningPathsAsync();
            if (learningPaths == null || !learningPaths.Any())
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

            return Ok(result);
        }

        [HttpPost("addLearningPath")]
        public async Task<IActionResult> AddLearningPath([FromBody] LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return BadRequest("Learning Path data is required.");
            }

            await _learningPathRepository.AddLearningPathAsync(learningPath);
            return Ok(new { message = "Learning Path added successfully." });
        }

        [HttpPut("updateLearningPathProgress/{learningPathStatusId}")]
        public async Task<IActionResult> UpdateLearningPathProgress(string learningPathStatusId, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId) || !requestBody.TryGetProperty("progress", out JsonElement progressElement) || !progressElement.TryGetDouble(out double progress))
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            var success = await _learningPathRepository.UpdateLearningPathProgressAsync(learningPathStatusId, progress);
            if (success)
            {
                return Ok(new { message = "Learning path progress updated successfully." });
            }

            return NotFound(new { message = "Learning path status not found." });
        }

        [HttpPut("updateSubtopicStatus/{learningPathStatusId}/{subtopicName}")]
        public async Task<IActionResult> UpdateSubtopicStatus(string learningPathStatusId, string subtopicName, [FromBody] JsonElement requestBody)
        {
            if (!ObjectId.TryParse(learningPathStatusId, out var objectId) || !requestBody.TryGetProperty("completed", out JsonElement completedElement) || (completedElement.ValueKind != JsonValueKind.True && completedElement.ValueKind != JsonValueKind.False))
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            var success = await _learningPathRepository.UpdateSubtopicStatusAsync(learningPathStatusId, subtopicName, completedElement.GetBoolean());
            if (success)
            {
                return Ok(new { message = "Subtopic status updated successfully." });
            }

            return NotFound(new { message = "Learning path status or subtopic not found." });
        }
    }
}
