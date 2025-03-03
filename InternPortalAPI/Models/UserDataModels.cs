using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace YourNamespace.Models
{
    public class Goal
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public required string UserId { get; set; } // Reference to the user (this should match the logged-in user)

        public required string GoalName { get; set; }

        public required string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public class PocProject
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public required string UserId { get; set; } // Reference to the user

        public required string ProjectName { get; set; } // Renamed from ProjectName to Title

        public required string Description { get; set; }

        public required string Status { get; set; } // e.g., "inProgress", "completed"

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; } // EndDate is optional, so we use DateTime?
        public DateTime CreatedAt { get; set; }
    }

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

    public class Subtopic
    {
        [BsonElement("name")]
        public required string Name { get; set; } // Name of the subtopic

        [BsonElement("completed")]
        public bool Completed { get; set; } = false; // Completion status of the subtopic
    }
}
