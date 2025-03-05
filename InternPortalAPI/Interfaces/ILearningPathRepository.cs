using InternPortal.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace InternPortal.Interfaces
{
    public interface ILearningPathRepository
    {
        Task AddLearningPathStatusAsync(myLearningPath learningPathStatus);
        Task<IEnumerable<myLearningPath>> GetLearningPathStatusAsync(string userId);
        Task<bool> DeleteLearningPathStatusAsync(string learningPathStatusId);
        Task<IEnumerable<LearningPath>> GetLearningPathsAsync();
        Task AddLearningPathAsync(LearningPath learningPath);
        Task<bool> UpdateLearningPathProgressAsync(string learningPathStatusId, double progress);
        Task<bool> UpdateSubtopicStatusAsync(string learningPathStatusId, string subtopicName, bool completed);
    }
}
