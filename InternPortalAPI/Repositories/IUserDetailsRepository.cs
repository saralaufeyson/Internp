using InternPortal.Models;
using System.Threading.Tasks;

namespace InternPortal.Repositories
{
    public interface IUserDetailsRepository
    {
        Task<UserDetails?> GetUserDetailsAsync(string userId);
        Task CreateUserDetailsAsync(UserDetails userDetails);
        Task<bool> UpdateUserDetailsAsync(string userId, UserDetails userDetails);
        Task DeleteUserDetailsAsync(string userId);
    }
}
