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

        
    

    }
}
