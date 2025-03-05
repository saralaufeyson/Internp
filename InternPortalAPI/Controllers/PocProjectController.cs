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
    public class PocProjectController : ControllerBase
    {
        private readonly IMongoCollection<PocProject> _pocProjectCollection;

        public PocProjectController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
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

            // Log the received project data
            Console.WriteLine($"Received project data: {project.ProjectName}, {project.Description}, {project.Status}, {project.StartDate}, {project.EndDate}");

            // Set the creation time of the project (if you need it)
            project.CreatedAt = DateTime.UtcNow;

            // Store the PoC project with the user's ID
            await _pocProjectCollection.InsertOneAsync(project);
            Console.WriteLine("PoC Project added to the database.");
            return Ok(new { message = "PoC Project added successfully." });
        }

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
    }
}
