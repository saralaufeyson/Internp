using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace YourNamespace.Models
{
    public class myLearningPath
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("userid")]
        public required string UserId { get; set; } // Reference to the user

        [BsonElement("learningPathId")]
        public required string LearningPathId { get; set; } // Reference to the learning path

        [BsonElement("status")]
        public required string Status { get; set; } // e.g., "completed", "not completed"

        [BsonElement("title")]
        public required string Title { get; set; } // Title of the learning path

        [BsonElement("description")]
        public required string Description { get; set; } // Description of the learning path

        [BsonElement("link")]
        public required string Link { get; set; } // Link to the learning path

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("progress")]
        public double Progress { get; set; } = 0; // Progress of the learning path

        [BsonElement("subtopics")]
        public List<Subtopic> Subtopics { get; set; } = new List<Subtopic>(); // List of subtopics
    }
}
