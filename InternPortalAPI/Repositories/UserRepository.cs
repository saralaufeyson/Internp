using InternPortal.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Text.Json;

namespace InternPortal.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<PocProject> _pocProjectCollection;

        public UserRepository(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("database0");
            _users = database.GetCollection<User>("Users");
            _pocProjectCollection = database.GetCollection<PocProject>("PocProjects");
        }

        public async Task<User> GetUserByIdAsync(string userId) =>
            await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();

        public async Task<User> GetUserByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task<User> GetUserByUsernameAsync(string username) =>
            await _users.Find(u => u.Username == username).FirstOrDefaultAsync();

        public async Task<IEnumerable<User>> GetAllUsersAsync() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task AddUserAsync(User user) =>
            await _users.InsertOneAsync(user);

        public async Task<bool> UpdateUserAsync(User user)
        {
            var result = await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task DeleteUserAsync(string userId) =>
            await _users.DeleteOneAsync(u => u.Id == userId);

        public async Task<string> RegisterUserAsync(User user)
        {
            var existingUser = await GetUserByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return "User with this email already exists.";
            }

            user.Role = user.Role ?? "Intern"; // Default role is Intern if not provided
            await AddUserAsync(user);
            return "User registered successfully.";
        }

        public async Task<(bool Success, string Message, User? User)> LoginUserAsync(LoginRequest request)
        {
            var existingUser = await GetUserByEmailAsync(request.Email);
            if (existingUser == null || existingUser.Password != request.Password)
            {
                return (false, "Invalid email or password.", null);
            }

            return (true, "Login successful.", existingUser);
        }

        public async Task<string> GetUserRoleAsync(string userId)
        {
            var user = await GetUserByIdAsync(userId);
            if (user == null)
            {
                return "User not found.";
            }
            return user.Role;
        }

        public async Task<List<User>> GetUsersByRoleAsync(string role) =>
            await _users.Find(u => u.Role == role).ToListAsync();

        public async Task<long> GetUsersCountByRoleAsync(string role) =>
            await _users.CountDocumentsAsync(u => u.Role == role);

        public async Task<bool> AssignInternsToMentorAsync(string mentorId, List<string> internIds)
        {
            var mentor = await _users.Find(u => u.Id == mentorId && u.Role == "Mentor").FirstOrDefaultAsync();
            if (mentor == null)
            {
                return false;
            }

            if (internIds == null)
            {
                return false;
            }

            var interns = await _users.Find(u => u.Id != null && internIds.Contains(u.Id) && u.Role == "Intern").ToListAsync();
            if (interns.Count != internIds.Count)
            {
                return false;
            }

            var update = Builders<User>.Update.Set(u => u.AssignedInterns, internIds);
            var result = await _users.UpdateOneAsync(u => u.Id == mentorId, update);

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<List<object>> GetMentorsWithInternsAsync()
        {
            var mentors = await _users.Find(u => u.Role == "Mentor").ToListAsync();
            var mentorDetails = new List<object>();

            foreach (var mentor in mentors)
            {
                var internIds = mentor.AssignedInterns ?? new List<string>();
                var interns = await _users.Find(u => internIds != null && internIds.Contains(u.Id ?? string.Empty)).ToListAsync();

                mentorDetails.Add(new
                {
                    MentorId = mentor.Id,
                    MentorName = mentor.Username,
                    Interns = interns.Select(i => new
                    {
                        InternId = i.Id,
                        InternName = i.Username,
                        InternEmail = i.Email
                    }).ToList()
                });
            }

            return mentorDetails;
        }

        public async Task<object> GetPocProjectStatsAsync(string userId)
        {
            var totalPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId);
            var inProgressPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId && p.Status == "inProgress");
            var completedPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.UserId == userId && p.Status == "completed");

            return new
            {
                totalPocs,
                inProgressPocs,
                completedPocs
            };
        }

        public async Task<object> GetAllPocProjectStatsAsync()
        {
            var totalPocs = await _pocProjectCollection.CountDocumentsAsync(_ => true);
            var inProgressPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.Status == "inProgress");
            var completedPocs = await _pocProjectCollection.CountDocumentsAsync(p => p.Status == "completed");

            return new
            {
                totalPocs,
                inProgressPocs,
                completedPocs
            };
        }

        public async Task<bool> UploadImageAsync(string userId, IFormFile image)
        {
            if (image == null || image.Length == 0 || !image.ContentType.StartsWith("image/"))
            {
                return false;
            }

            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return false;
            }

            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();

            var update = Builders<User>.Update.Set(u => u.ProfileImage, imageBytes);
            var result = await _users.UpdateOneAsync(u => u.Id == userId, update);

            return result.ModifiedCount > 0;
        }

        public async Task<byte[]> GetProfileImageAsync(string userId)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.ProfileImage ?? Array.Empty<byte>();
        }

        public async Task<bool> UpdateAboutSectionAsync(string userId, JsonElement requestBody)
        {
            if (!requestBody.TryGetProperty("about", out JsonElement aboutElement) || aboutElement.ValueKind != JsonValueKind.String)
            {
                return false;
            }

            var about = aboutElement.GetString();
            var update = Builders<User>.Update.Set(u => u.About, about);
            var result = await _users.UpdateOneAsync(u => u.Id == userId, update);

            return result.ModifiedCount > 0;
        }

        public async Task<string> GetAboutSectionAsync(string userId)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.About ?? string.Empty;
        }
    }
}
