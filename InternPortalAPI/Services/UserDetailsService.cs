using MongoDB.Driver;
using YourNamespace.Models;

namespace YourNamespace.Services
{
    public class UserDetailsService
    {
        private readonly IMongoCollection<UserDetails> _userDetailsCollection;

        public UserDetailsService(IMongoClient client)
        {
            var database = client.GetDatabase("database0");
            _userDetailsCollection = database.GetCollection<UserDetails>("UserDetails");
        }

        // ✅ Get User Details by userId
        public async Task<UserDetails?> GetUserDetailsAsync(string userId) =>
            await _userDetailsCollection.Find(u => u.UserId == userId).FirstOrDefaultAsync();

        // ✅ Create User Details (Add new)
        public async Task CreateUserDetailsAsync(UserDetails userDetails) =>
            await _userDetailsCollection.InsertOneAsync(userDetails);

        // ✅ Update User Details (Edit)
        public async Task<bool> UpdateUserDetailsAsync(string userId, UserDetails userDetails)
        {
            var result = await _userDetailsCollection.ReplaceOneAsync(ud => ud.UserId == userId, userDetails);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        // ✅ Delete User Details
        public async Task DeleteUserDetailsAsync(string userId) =>
            await _userDetailsCollection.DeleteOneAsync(u => u.UserId == userId);
    }
}
