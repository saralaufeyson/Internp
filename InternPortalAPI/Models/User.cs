using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InternPortal.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public required string Username { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("password")]
        public required string Password { get; set; }

        [BsonElement("role")]
        public required string Role { get; set; }

        [BsonElement("assignedInterns")]
        public List<string>? AssignedInterns { get; set; } = new List<string>();

        [BsonElement("assignedMentorId")]
        public string? AssignedMentorId { get; set; }

        [BsonElement("profileImage")]
        public byte[]? ProfileImage { get; set; }

        [BsonElement("about")]
        public string? About { get; set; }
    }
}