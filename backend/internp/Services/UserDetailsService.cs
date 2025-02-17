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

        public async Task UpdateUserDetailsAsync(string userId, UserDetails userDetails)
        {
            // Ensure _id is not part of the update data
            var updateDefinition = Builders<UserDetails>.Update
                .Set(u => u.PhoneNumber, userDetails.PhoneNumber)
                .Set(u => u.Email, userDetails.Email)
                .Set(u => u.Address, userDetails.Address)
                .Set(u => u.TenthGrade, userDetails.TenthGrade)
                .Set(u => u.TwelfthGrade, userDetails.TwelfthGrade)
                .Set(u => u.BTechCgpa, userDetails.BTechCgpa);

            var result = await _userDetailsCollection.UpdateOneAsync(
                u => u.UserId == userId, // Filter by userId
                updateDefinition // Update the fields
            );

            if (result.MatchedCount == 0)
            {
                throw new Exception("User details not found.");
            }
        }


        // ✅ Delete User Details
        public async Task DeleteUserDetailsAsync(string userId) =>
            await _userDetailsCollection.DeleteOneAsync(u => u.UserId == userId);
    }
}
