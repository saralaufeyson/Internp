using Microsoft.AspNetCore.Mvc;
using InternPortal.Models;
using InternPortal.Interfaces;
using System.Threading.Tasks;
using System.Text.Json;

namespace InternPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PocProjectController : ControllerBase
    {
        private readonly IPocProjectRepository _pocProjectRepository;

        public PocProjectController(IPocProjectRepository pocProjectRepository)
        {
            _pocProjectRepository = pocProjectRepository;
        }

        [HttpPost("addPocProject")]
        public async Task<IActionResult> AddPocProject([FromBody] PocProject project)
        {
            if (project == null || string.IsNullOrEmpty(project.UserId))
            {
                return BadRequest("Project data and UserId are required.");
            }

            await _pocProjectRepository.AddPocProjectAsync(project);
            return Ok(new { message = "PoC Project added successfully." });
        }

        [HttpGet("getPocProjects/{userId}")]
        public async Task<IActionResult> GetPocProjects(string userId)
        {
            var projects = await _pocProjectRepository.GetPocProjectsByUserIdAsync(userId);
            if (projects.Count == 0)
            {
                return NotFound(new { message = "No PoC projects found for this user." });
            }

            var result = projects.Select(p => new
            {
                _id = p.Id.ToString(),
                p.UserId,
                p.ProjectName,
                p.Description,
                p.Status,
                p.StartDate,
                p.EndDate,
                p.CreatedAt
            });

            return Ok(result);
        }

        [HttpDelete("deletePocProject/{projectId}")]
        public async Task<IActionResult> DeletePocProject(string projectId)
        {
            var success = await _pocProjectRepository.DeletePocProjectAsync(projectId);
            if (success)
            {
                return Ok(new { message = "PoC project deleted successfully." });
            }

            return NotFound(new { message = "PoC project not found." });
        }

        [HttpPut("updatePocProject/{projectId}")]
        public async Task<IActionResult> UpdatePocProject(string projectId, [FromBody] JsonElement requestBody)
        {
            var success = await _pocProjectRepository.UpdatePocProjectAsync(projectId, requestBody);
            if (success)
            {
                return Ok(new { message = "PoC Project updated successfully." });
            }

            return NotFound(new { message = "PoC Project not found or no changes were made." });
        }
    }
}
