using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace InternPortal.Models
{
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
}
