using InternPortal.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace InternPortal.Repositories
{
    public class PocProjectRepository : IPocProjectRepository
    {
        private readonly IMongoCollection<PocProject> _pocProjectCollection;

        public PocProjectRepository(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
        }

        public async Task AddPocProjectAsync(PocProject project)
        {
            project.CreatedAt = DateTime.UtcNow;
            await _pocProjectCollection.InsertOneAsync(project);
        }

        public async Task<List<PocProject>> GetPocProjectsByUserIdAsync(string userId)
        {
            return await _pocProjectCollection.Find(p => p.UserId == userId).ToListAsync();
        }

        public async Task<bool> DeletePocProjectAsync(string projectId)
        {
            if (!ObjectId.TryParse(projectId, out var objectId))
            {
                return false;
            }

            var result = await _pocProjectCollection.DeleteOneAsync(p => p.Id == objectId);
            return result.DeletedCount > 0;
        }

        public async Task<bool> UpdatePocProjectAsync(string projectId, JsonElement requestBody)
        {
            if (!ObjectId.TryParse(projectId, out var objectId))
            {
                return false;
            }

            DateTime? endDate = null;
            if (requestBody.TryGetProperty("endDate", out JsonElement endDateElement))
            {
                endDate = endDateElement.ValueKind == JsonValueKind.Null ? (DateTime?)null : endDateElement.GetDateTime();
            }

            string? status = null;
            if (requestBody.TryGetProperty("status", out JsonElement statusElement) && statusElement.ValueKind == JsonValueKind.String)
            {
                status = statusElement.GetString();
            }

            if (endDate == null && status == null)
            {
                return false;
            }

            var existingProject = await _pocProjectCollection.Find(p => p.Id == objectId).FirstOrDefaultAsync();
            if (existingProject == null)
            {
                return false;
            }

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

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
    }
}
