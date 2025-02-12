using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using YourNamespace.Models;
[ApiController]
[Route("api/[controller]")]
public class MentorMenteeController : ControllerBase
{
    private readonly IMongoCollection<MentorMentee> _mentorMenteeCollection;

    public MentorMenteeController(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("database0");
        _mentorMenteeCollection = database.GetCollection<MentorMentee>("MentorMentees");
    }

    [HttpGet]
    public async Task<IActionResult> GetMentorMentees()
    {
        var mentorMentees = await _mentorMenteeCollection.Find(_ => true).ToListAsync();
        return Ok(mentorMentees);
    }
}
