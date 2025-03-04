using YourNamespace.Models;
using System.Threading.Tasks;

namespace YourNamespace.Repositories
{
    public interface IUserDetailsRepository
    {
        Task<UserDetails?> GetUserDetailsAsync(string userId);
        Task CreateUserDetailsAsync(UserDetails userDetails);
        Task<bool> UpdateUserDetailsAsync(string userId, UserDetails userDetails);
        Task DeleteUserDetailsAsync(string userId);
    }
}
