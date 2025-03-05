using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using InternPortal.Models;
using InternPortal.Interfaces;
namespace Internp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentorController : ControllerBase
    {
        private readonly IMentorRepository _mentorRepository;

        public MentorController(IMentorRepository mentorRepository)
        {
            _mentorRepository = mentorRepository;
        }

        // ✅ API: Get assigned interns under a mentor
        [HttpGet("{mentorId}/interns")]
        public async Task<ActionResult<IEnumerable<User>>> GetInternsUnderMentor(string mentorId)
        {
            var result = await _mentorRepository.GetInternsUnderMentor(mentorId);
            if (result == null)
            {
                return NotFound("No interns assigned to this mentor.");
            }
            return Ok(result);
        }

        // ✅ API: Get total goals from all assigned interns
        [HttpGet("{mentorId}/total-goals")]
        public async Task<ActionResult> GetTotalInternGoals(string mentorId)
        {
            var result = await _mentorRepository.GetTotalInternGoals(mentorId);
            if (result == null)
            {
                return NotFound("No interns assigned to this mentor.");
            }
            return Ok(result);
        }

        // ✅ API: Get all POCs for assigned interns
        [HttpGet("{mentorId}/total-pocs")]
        public async Task<ActionResult<int>> GetTotalInternPocs(string mentorId)
        {
            var result = await _mentorRepository.GetTotalInternPocs(mentorId);
            if (result == null)
            {
                return NotFound("No interns assigned to this mentor.");
            }
            return Ok(result);
        }

        // ✅ API: Get in-progress POCs for assigned interns
        [HttpGet("{mentorId}/poc-project-stats")]
        public async Task<IActionResult> GetPocProjectStats(string mentorId)
        {
            var result = await _mentorRepository.GetPocProjectStats(mentorId);
            if (result == null)
            {
                return NotFound("No interns assigned to this mentor.");
            }
            return Ok(result);
        }

        // ✅ API: Get learning paths for assigned interns
        [HttpGet("{mentorId}/interns-learning-paths")]
        public async Task<IActionResult> GetInternsLearningPaths(string mentorId)
        {
            var result = await _mentorRepository.GetInternsLearningPaths(mentorId);
            if (result == null)
            {
                return NotFound("No learning paths found for assigned interns.");
            }
            return Ok(result);
        }
    }
}
