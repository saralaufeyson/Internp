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

        public required string ProjectName  { get; set; } // Renamed from ProjectName to Title

        public required string Description { get; set; }

        public required string Status { get; set; } // e.g., "inProgress", "completed"

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; } // EndDate is optional, so we use DateTime?
        public DateTime CreatedAt { get; internal set; }
    }


    public class LearningPath
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public required string UserId { get; set; } // Reference to the user

        public required string CourseName { get; set; }

        public required string Duration { get; set; }

        public required string ProgressStatus { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
