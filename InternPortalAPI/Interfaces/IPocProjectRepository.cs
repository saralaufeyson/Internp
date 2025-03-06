using InternPortal.Models;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace InternPortal.Interfaces
{
    public interface IPocProjectRepository
    {
        Task AddPocProjectAsync(PocProject project);
        Task<List<PocProject>> GetPocProjectsByUserIdAsync(string userId);
        Task<bool> DeletePocProjectAsync(string projectId);
        Task<bool> UpdatePocProjectAsync(string projectId, JsonElement requestBody);
    }
}
