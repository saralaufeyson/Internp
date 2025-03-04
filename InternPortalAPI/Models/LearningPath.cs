using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace YourNamespace.Models
{
    public class LearningPath
    {
        [BsonId] // Marks the ID field
        [BsonRepresentation(BsonType.ObjectId)] // Tells MongoDB to use ObjectId as the Id
        public required string Id { get; set; }

        [BsonElement("title")]  // Maps the field to "title" in MongoDB
        public required string Title { get; set; }

        [BsonElement("description")]  // Maps the field to "description" in MongoDB
        public required string Description { get; set; }

        [BsonElement("link")]  // Maps the field to "link" in MongoDB
        public required string Link { get; set; }

        [BsonElement("subtopics")]
        public List<Subtopic> Subtopics { get; set; } = new List<Subtopic>(); // List of subtopics
    }
}
