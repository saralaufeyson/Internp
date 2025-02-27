using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class InternFeedback
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("internId")]
    public string? InternId { get; set; }

    [BsonElement("fullName")]
    public string? FullName { get; set; }

 

    [BsonElement("mentorName")]
    public string? MentorName { get; set; }

    [BsonElement("ratings")]
    public PerformanceRatings Ratings { get; set; } = new();

    [BsonElement("tasks")]
    public List<MonthlyTask> Tasks { get; set; } = new();

    [BsonElement("recommendation")]
    public string? Recommendation { get; set; } = "";

    [BsonElement("areasOfImprovement")]
    public string? AreasOfImprovement { get; set; } = "";

    [BsonElement("feedback")]
    public string? Feedback { get; set; } = "";
}

// Models/PerformanceRatings.cs
public class PerformanceRatings
{
    [BsonElement("domainKnowledge")]
    public int? DomainKnowledge { get; set; }

    [BsonElement("functionalKnowledge")]
    public int? FunctionalKnowledge { get; set; }

    [BsonElement("processAdherence")]
    public int? ProcessAdherence { get; set; }

    [BsonElement("teamWork")]
    public int? TeamWork { get; set; }

    [BsonElement("learningCapabilities")]
    public int? LearningCapabilities { get; set; }

    [BsonElement("attentionToDetail")]
    public int? AttentionToDetail { get; set; }

    [BsonElement("communication")]
    public int? Communication { get; set; }

    [BsonElement("curiosityAndProactiveness")]
    public int? CuriosityAndProactiveness { get; set; }

    [BsonElement("problemSolving")]
    public int? ProblemSolving { get; set; }

    [BsonElement("delivery")]
    public int? Delivery { get; set; }
}

// Models/MonthlyTask.cs
public class MonthlyTask
{
    [BsonElement("taskDetails")]
    public string? TaskDetails { get; set; } = "";

    [BsonElement("startDate")]
    public DateTime? StartDate { get; set; }

    [BsonElement("endDate")]
    public DateTime? EndDate { get; set; } // Keep endDate as nullable

    [BsonElement("priority")]
    public int? Priority { get; set; }

    [BsonElement("weightage")]
    public int? Weightage { get; set; }

    [BsonElement("status")]
    public string? Status { get; set; } = "Yet to start";

    [BsonElement("dmRating")]
    public int? DMRating { get; set; }
}