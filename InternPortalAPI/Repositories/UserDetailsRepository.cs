using YourNamespace.Models;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace YourNamespace.Repositories
{
    public class UserDetailsRepository : IUserDetailsRepository
    {
        private readonly IMongoCollection<UserDetails> _userDetailsCollection;

        public UserDetailsRepository(IMongoClient client)
        {
            var database = client.GetDatabase("database0");
            _userDetailsCollection = database.GetCollection<UserDetails>("UserDetails");
        }

        public async Task<UserDetails?> GetUserDetailsAsync(string userId)
        {
            return await _userDetailsCollection.Find(u => u.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task CreateUserDetailsAsync(UserDetails userDetails)
        {
            await _userDetailsCollection.InsertOneAsync(userDetails);
        }

        public async Task<bool> UpdateUserDetailsAsync(string userId, UserDetails userDetails)
        {
            var result = await _userDetailsCollection.ReplaceOneAsync(ud => ud.UserId == userId, userDetails);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task DeleteUserDetailsAsync(string userId)
        {
            await _userDetailsCollection.DeleteOneAsync(u => u.UserId == userId);
        }
    }
}
