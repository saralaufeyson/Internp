using MongoDB.Bson.Serialization.Attributes;

namespace YourNamespace.Models
{
    public class Subtopic
    {
        [BsonElement("name")]
        public required string Name { get; set; } // Name of the subtopic

        [BsonElement("completed")]
        public bool Completed { get; set; } = false; // Completion status of the subtopic
    }
}
