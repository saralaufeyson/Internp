using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace YourNamespace.Models
{
    public class UserDetails
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public required string UserId { get; set; } // Mapping to the User collection

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
        [BsonElement("experience")]
        public List<string> Experience { get; set; } = new List<string>();

        [BsonElement("skills")]
        public List<string> Skills { get; set; } = new List<string>();
    }
}
