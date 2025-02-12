using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MentorMentee
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string MentorName { get; set; }
    public List<string> MenteeNames { get; set; }
}
