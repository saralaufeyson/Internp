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

    [BsonElement("overallRating")]
    public double OverallRating { get; set; }

    [BsonElement("reviewMonth")]
    public DateTime ReviewMonth { get; set; } // Change to string to store month and year

    public void CalculateOverallRating()
    {
        var ratings = new List<int?>
        {
            Ratings.DomainKnowledge,
            Ratings.FunctionalKnowledge,
            Ratings.ProcessAdherence,
            Ratings.TeamWork,
            Ratings.LearningCapabilities,
            Ratings.AttentionToDetail,
            Ratings.Communication,
            Ratings.CuriosityAndProactiveness,
            Ratings.ProblemSolving,
            Ratings.Delivery
        };

        OverallRating = ratings.Average(r => r ?? 0);
    }
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

    [BsonElement("month")]
    public string? Month { get; set; } = "";
}