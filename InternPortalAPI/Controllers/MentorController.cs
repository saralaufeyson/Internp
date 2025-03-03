using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YourNamespace.Models;

namespace Internp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentorController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Goal> _goalsCollection;
        private readonly IMongoCollection<PocProject> _pocsCollection;
        private readonly IMongoCollection<myLearningPath> _learningPathCollection;

        public MentorController(IMongoClient client)
        {
            var database = client.GetDatabase("database0");
            _usersCollection = database.GetCollection<User>("Users");
            _goalsCollection = database.GetCollection<Goal>("Goals");
            _pocsCollection = database.GetCollection<PocProject>("PocProjects");
            _learningPathCollection = database.GetCollection<myLearningPath>("myLearningPath");
        }

        // ✅ API: Get assigned interns under a mentor
        [HttpGet("{mentorId}/interns")]
        public async Task<ActionResult<IEnumerable<User>>> GetInternsUnderMentor(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();

            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return NotFound("No interns assigned to this mentor.");
            }

            var interns = await _usersCollection.Find(u => mentor.AssignedInterns != null && u.Id != null && mentor.AssignedInterns.Contains(u.Id)).ToListAsync();
            return Ok(interns);
        }

        // ✅ API: Get total goals from all assigned interns
        [HttpGet("{mentorId}/total-goals")]
        public async Task<ActionResult> GetTotalInternGoals(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();

            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return NotFound("No interns assigned to this mentor.");
            }

            var internsGoals = await _goalsCollection
            .Aggregate()
            .Match(g => mentor.AssignedInterns.Contains(g.UserId))
            .Group(g => g.UserId, g => new { UserId = g.Key, GoalCount = g.Count() })
            .ToListAsync();

            long totalGoals = internsGoals.Sum(g => g.GoalCount);

            return Ok(new
            {
                InternsGoals = internsGoals,
                TotalGoals = totalGoals
            });
        }

        // ✅ API: Get all POCs for assigned interns
        [HttpGet("{mentorId}/total-pocs")]
        public async Task<ActionResult<int>> GetTotalInternPocs(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();

            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return NotFound("No interns assigned to this mentor.");
            }

            int totalPocs = (int)await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId));
            return Ok(new { totalPocs });
        }

        // ✅ API: Get in-progress POCs for assigned interns
        [HttpGet("{mentorId}/poc-project-stats")]
        public async Task<IActionResult> GetPocProjectStats(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();

            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return NotFound("No interns assigned to this mentor.");
            }

            var totalPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId));
            var inProgressPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId) && p.Status.ToLower() == "inprogress");
            var completedPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId) && p.Status.ToLower() == "completed");

            return Ok(new
            {
                totalPocs,
                inProgressPocs,
                completedPocs
            });
        }
        [HttpGet("{mentorId}/interns-learning-paths")]
        public async Task<IActionResult> GetInternsLearningPaths(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();

            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return NotFound("No interns assigned to this mentor.");
            }

            var learningPaths = await _learningPathCollection
                .Find(lp => mentor.AssignedInterns.Contains(lp.UserId))
                .ToListAsync();

            if (learningPaths == null || !learningPaths.Any())
            {
                return NotFound("No learning paths found for assigned interns.");
            }

            return Ok(learningPaths);
        }


    }
}
