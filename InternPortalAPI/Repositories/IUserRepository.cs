using YourNamespace.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace YourNamespace.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByIdAsync(string userId);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByUsernameAsync(string username);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task AddUserAsync(User user);
        Task<bool> UpdateUserAsync(User user);
        Task DeleteUserAsync(string userId);
        Task<string> RegisterUserAsync(User user);
        Task<(bool Success, string Message, User? User)> LoginUserAsync(LoginRequest request); Task<string> GetUserRoleAsync(string userId);
        Task<List<User>> GetUsersByRoleAsync(string role);
        Task<long> GetUsersCountByRoleAsync(string role);
        Task<bool> AssignInternsToMentorAsync(string mentorId, List<string> internIds);
        Task<List<object>> GetMentorsWithInternsAsync();
        Task<object> GetPocProjectStatsAsync(string userId);
        Task<object> GetAllPocProjectStatsAsync();
        Task<bool> UploadImageAsync(string userId, IFormFile image);
        Task<byte[]> GetProfileImageAsync(string userId);
        Task<bool> UpdateAboutSectionAsync(string userId, JsonElement requestBody);
        Task<string> GetAboutSectionAsync(string userId);
    }
}
