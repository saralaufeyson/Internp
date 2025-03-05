using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace InternPortal.Models
{
    public class Experience
    {
        [BsonElement("title")]
        public required string Title { get; set; }

        [BsonElement("company")]
        public required string Company { get; set; }

        [BsonElement("duration")]
        public required string Duration { get; set; } // e.g., "Jan 2025 - Present"

        [BsonElement("location")]
        public required string Location { get; set; }

        // Removed the skills field
    }

    public class UserDetails
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public required string UserId { get; set; }

        [BsonElement("phoneNumber")]
        public required string PhoneNumber { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("address")]
        public required string Address { get; set; }

        [BsonElement("tenthGrade")]
        public required string TenthGrade { get; set; }

        [BsonElement("twelfthGrade")]
        public required string TwelfthGrade { get; set; }

        [BsonElement("btechCgpa")]
        public required string BTechCgpa { get; set; }

        [BsonElement("experiences")]
        public List<Experience> Experiences { get; set; } = new List<Experience>();
    }
}
