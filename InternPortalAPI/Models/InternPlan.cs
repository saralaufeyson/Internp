using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class InternPlan
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public required string UserId { get; set; }

    [BsonElement("sixMonthPlan")]
    public string SixMonthPlan { get; set; } = "";

    [BsonElement("oneYearPlan")]
    public string OneYearPlan { get; set; } = "";

    [BsonElement("threeYearPlan")]
    public string ThreeYearPlan { get; set; } = "";
}
