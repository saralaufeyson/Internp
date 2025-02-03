using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
using System.Threading.Tasks;

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

        // Add a new Goal
        [HttpPost("addGoal")]
        public async Task<IActionResult> AddGoal([FromBody] Goal goal)
        {
            if (goal == null)
            {
                return BadRequest("Goal is required.");
            }

            await _goalCollection.InsertOneAsync(goal);
            return Ok("Goal added successfully.");
        }

        // Get all Goals for a User
        [HttpGet("getGoals/{userId}")]
        public async Task<IActionResult> GetGoals(string userId)
        {
            var goals = await _goalCollection.Find(g => g.UserId == userId).ToListAsync();
            return Ok(goals);
        }

        // Add a new PoC Project
        [HttpPost("addPocProject")]
        public async Task<IActionResult> AddPocProject([FromBody] PocProject project)
        {
            if (project == null)
            {
                return BadRequest("Project data is required.");
            }

            await _pocProjectCollection.InsertOneAsync(project);
            return Ok("PoC Project added successfully.");
        }

        // Get all PoC Projects for a User
        [HttpGet("getPocProjects/{userId}")]
        public async Task<IActionResult> GetPocProjects(string userId)
        {
            var projects = await _pocProjectCollection.Find(p => p.UserId == userId).ToListAsync();
            return Ok(projects);
        }

        // Add a new Learning Path
        [HttpPost("addLearningPath")]
        public async Task<IActionResult> AddLearningPath([FromBody] LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return BadRequest("Learning Path data is required.");
            }

            await _learningPathCollection.InsertOneAsync(learningPath);
            return Ok("Learning Path added successfully.");
        }

        // Get all Learning Paths for a User
        [HttpGet("getLearningPaths/{userId}")]
        public async Task<IActionResult> GetLearningPaths(string userId)
        {
            var learningPaths = await _learningPathCollection.Find(l => l.UserId == userId).ToListAsync();
            return Ok(learningPaths);
        }
    }
}
