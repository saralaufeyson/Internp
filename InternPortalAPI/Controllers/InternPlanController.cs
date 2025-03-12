using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/[controller]")]
[ApiController]
public class InternPlanController : ControllerBase
{
    private readonly IMongoCollection<InternPlan> _internPlans;

    public InternPlanController(IMongoClient client)
    {
        var database = client.GetDatabase("database0");
        _internPlans = database.GetCollection<InternPlan>("InternPlans");
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitPlan([FromBody] InternPlan plan)
    {
        if (plan == null)
            return BadRequest("Invalid plan data.");

        var existingPlan = await _internPlans.Find(p => p.UserId == plan.UserId).FirstOrDefaultAsync();

        if (existingPlan == null)
        {
            await _internPlans.InsertOneAsync(plan);
        }
        else
        {
            var update = Builders<InternPlan>.Update
                .Set(p => p.SixMonthPlan, plan.SixMonthPlan)
                .Set(p => p.OneYearPlan, plan.OneYearPlan)
                .Set(p => p.ThreeYearPlan, plan.ThreeYearPlan);

            await _internPlans.UpdateOneAsync(p => p.UserId == plan.UserId, update);
        }

        return Ok(new { message = "Plan saved successfully!" });
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPlan(string userId)
    {
        var plan = await _internPlans.Find(p => p.UserId == userId).FirstOrDefaultAsync();
        if (plan == null)
        {
            return NotFound("No plan found for this user.");
        }
        return Ok(plan);
    }
}
