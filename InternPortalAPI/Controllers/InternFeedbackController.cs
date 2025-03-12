using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/[controller]")]
[ApiController]
public class InternFeedbackController : ControllerBase
{
    private readonly IMongoCollection<InternFeedback> _internFeedbacks;

    public InternFeedbackController(IMongoClient client)
    {
        var database = client.GetDatabase("database0");
        _internFeedbacks = database.GetCollection<InternFeedback>("InternFeedbacks");
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitFeedback([FromBody] InternFeedback feedback)
    {
        if (feedback == null)
        {
            return BadRequest("Invalid feedback data.");
        }

        feedback.CalculateOverallRating();

        var existingFeedback = await _internFeedbacks
            .Find(f => f.InternId == feedback.InternId && f.ReviewMonth == feedback.ReviewMonth)
            .FirstOrDefaultAsync();

        if (existingFeedback == null)
        {
            await _internFeedbacks.InsertOneAsync(feedback);
        }
        else
        {
            var update = Builders<InternFeedback>.Update
                .Set(f => f.FullName, feedback.FullName)
                .Set(f => f.MentorName, feedback.MentorName)
                .Set(f => f.Ratings, feedback.Ratings)
                .Set(f => f.Tasks, feedback.Tasks)
                .Set(f => f.Recommendation, feedback.Recommendation)
                .Set(f => f.AreasOfImprovement, feedback.AreasOfImprovement)
                .Set(f => f.Feedback, feedback.Feedback)
                .Set(f => f.OverallRating, feedback.OverallRating)
                .Set(f => f.ReviewMonth, feedback.ReviewMonth);

            await _internFeedbacks.UpdateOneAsync(f => f.InternId == feedback.InternId && f.ReviewMonth == feedback.ReviewMonth, update);
        }

        return Ok(new { message = "Feedback saved successfully!" });
    }

    [HttpGet("{internId}")]
    public async Task<IActionResult> GetFeedback(string internId)
    {
        var feedback = await _internFeedbacks
            .Find(f => f.InternId == internId)
            .FirstOrDefaultAsync();

        if (feedback == null)
        {
            return NotFound();
        }

        return Ok(feedback);
    }

    [HttpGet("mentor/{mentorName}")]
    public async Task<IActionResult> GetFeedbacksByMentor(string mentorName)
    {
        var feedbacks = await _internFeedbacks
            .Find(f => f.MentorName == mentorName)
            .ToListAsync();

        return Ok(feedbacks);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllFeedbacks()
    {
        var feedbacks = await _internFeedbacks.Find(_ => true).ToListAsync();
        return Ok(feedbacks);
    }

    [HttpDelete("{internId}")]
    public async Task<IActionResult> DeleteFeedback(string internId)
    {
        var result = await _internFeedbacks.DeleteOneAsync(f => f.InternId == internId);

        if (result.DeletedCount == 0)
        {
            return NotFound("No feedback found for this intern.");
        }

        return Ok(new { message = "Feedback deleted successfully!" });
    }
}