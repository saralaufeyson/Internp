using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace InternPortal.Models
{
    public class Goal
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public required string UserId { get; set; } // Reference to the user (this should match the logged-in user)

        public required string GoalName { get; set; }

        public required string Description { get; set; }

        public DateTime CreatedAt { get; set; }

        // New properties
        public string Status { get; set; } = string.Empty; // Initialize with a default value
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
