using MongoDB.Driver;
using InternPortal.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternPortal.Repositories
{
    public class MentorRepository : IMentorRepository
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Goal> _goalsCollection;
        private readonly IMongoCollection<PocProject> _pocsCollection;
        private readonly IMongoCollection<myLearningPath> _learningPathCollection;

        public MentorRepository(IMongoClient client)
        {
            var database = client.GetDatabase("database0");
            _usersCollection = database.GetCollection<User>("Users");
            _goalsCollection = database.GetCollection<Goal>("Goals");
            _pocsCollection = database.GetCollection<PocProject>("PocProjects");
            _learningPathCollection = database.GetCollection<myLearningPath>("myLearningPath");
        }

        public async Task<IEnumerable<User>> GetInternsUnderMentor(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();
            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return new List<User>();
            }
            return await _usersCollection.Find(u => u.Id != null && mentor.AssignedInterns.Contains(u.Id)).ToListAsync();
        }

        public async Task<object> GetTotalInternGoals(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();
            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return new List<User>();
            }
            var internsGoals = await _goalsCollection
                .Aggregate()
                .Match(g => mentor.AssignedInterns.Contains(g.UserId))
                .Group(g => g.UserId, g => new { UserId = g.Key, GoalCount = g.Count() })
                .ToListAsync();
            long totalGoals = internsGoals.Sum(g => g.GoalCount);
            return new { InternsGoals = internsGoals, TotalGoals = totalGoals };
        }

        public async Task<object> GetTotalInternPocs(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();
            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return new List<myLearningPath>();
            }
            int totalPocs = (int)await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId));
            return new { totalPocs };
        }

        public async Task<object> GetPocProjectStats(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();
            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return new List<myLearningPath>();
            }
            var totalPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId));
            var inProgressPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId) && p.Status.ToLower() == "inprogress");
            var completedPocs = await _pocsCollection.CountDocumentsAsync(p => mentor.AssignedInterns.Contains(p.UserId) && p.Status.ToLower() == "completed");
            return new { totalPocs, inProgressPocs, completedPocs };
        }

        public async Task<IEnumerable<myLearningPath>> GetInternsLearningPaths(string mentorId)
        {
            var mentor = await _usersCollection.Find(u => u.Id == mentorId).FirstOrDefaultAsync();
            if (mentor == null || mentor.AssignedInterns == null || !mentor.AssignedInterns.Any())
            {
                return new List<myLearningPath>();
            }
            return await _learningPathCollection.Find(lp => mentor.AssignedInterns.Contains(lp.UserId)).ToListAsync();
        }
    }
}
