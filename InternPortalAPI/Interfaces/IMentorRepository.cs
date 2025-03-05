using InternPortal.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternPortal.Interfaces
{
    public interface IMentorRepository
    {
        Task<IEnumerable<User>> GetInternsUnderMentor(string mentorId);
        Task<object> GetTotalInternGoals(string mentorId);
        Task<object> GetTotalInternPocs(string mentorId);
        Task<object> GetPocProjectStats(string mentorId);
        Task<IEnumerable<myLearningPath>> GetInternsLearningPaths(string mentorId);
    }
}
