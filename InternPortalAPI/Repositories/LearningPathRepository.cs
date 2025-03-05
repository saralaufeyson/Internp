using InternPortal.Interfaces;
using InternPortal.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace InternPortal.Repositories
{
    public class LearningPathRepository : ILearningPathRepository
    {
        private readonly IMongoCollection<LearningPath> _learningPathCollection;
        private readonly IMongoCollection<myLearningPath> _myLearningPathCollection;

        public LearningPathRepository(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _learningPathCollection = database.GetCollection<LearningPath>("LearningPaths");
            _myLearningPathCollection = database.GetCollection<myLearningPath>("myLearningPath");
        }

        public async Task AddLearningPathStatusAsync(myLearningPath learningPathStatus)
        {
            learningPathStatus.CreatedAt = DateTime.UtcNow;
            var learningPath = await _learningPathCollection.Find(lp => lp.Id == learningPathStatus.LearningPathId).FirstOrDefaultAsync();
            if (learningPath != null)
            {
                learningPathStatus.Subtopics = learningPath.Subtopics;
            }
            await _myLearningPathCollection.InsertOneAsync(learningPathStatus);
        }

        public async Task<IEnumerable<myLearningPath>> GetLearningPathStatusAsync(string userId)
        {
            return await _myLearningPathCollection.Find(lp => lp.UserId == userId).ToListAsync();
        }

        public async Task<bool> DeleteLearningPathStatusAsync(string learningPathStatusId)
        {
            var result = await _myLearningPathCollection.DeleteOneAsync(lp => lp.Id == ObjectId.Parse(learningPathStatusId));
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<LearningPath>> GetLearningPathsAsync()
        {
            return await _learningPathCollection.Find(lp => true).ToListAsync();
        }

        public async Task AddLearningPathAsync(LearningPath learningPath)
        {
            await _learningPathCollection.InsertOneAsync(learningPath);
        }

        public async Task<bool> UpdateLearningPathProgressAsync(string learningPathStatusId, double progress)
        {
            var update = Builders<myLearningPath>.Update.Set(lp => lp.Progress, progress);
            var result = await _myLearningPathCollection.UpdateOneAsync(lp => lp.Id == ObjectId.Parse(learningPathStatusId), update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> UpdateSubtopicStatusAsync(string learningPathStatusId, string subtopicName, bool completed)
        {
            var filter = Builders<myLearningPath>.Filter.And(
                Builders<myLearningPath>.Filter.Eq(lp => lp.Id, ObjectId.Parse(learningPathStatusId)),
                Builders<myLearningPath>.Filter.ElemMatch(lp => lp.Subtopics, st => st.Name == subtopicName)
            );
            var update = Builders<myLearningPath>.Update.Set("Subtopics.$.Completed", completed);
            var result = await _myLearningPathCollection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}
