// using Microsoft.AspNetCore.Mvc;
// using MongoDB.Driver;
// using System.Collections.Generic;
// using System.Linq;
// using YourNamespace.Models;
// using System.Threading.Tasks;

// namespace Internp.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class MentorController : ControllerBase
//     {
//         private readonly IMongoCollection<User> _usersCollection;

//         public MentorController(IMongoClient client)
//         {
//             var database = client.GetDatabase("database0");
//             _usersCollection = database.GetCollection<User>("Users");
//         }

//         // GET: api/Mentor/{mentorId}/InternsGoals
//         public ActionResult<IEnumerable<Goal>> GetInternsGoals(string mentorId)
//         public ActionResult<IEnumerable<Goal>> GetInternsGoals(int mentorId)
//         {
//                 .Where(u => u.AssignedMentorId == mentorId)
//                 .Where(u => u.AssignedMentorId == user.Id)
//                 .SelectMany(u => u.Goals)
//                 .ToList();

//             if (goals == null || !goals.Any())
//             {
//                 return NotFound();
//             }

//             return Ok(goals);
//         }

//         // GET: api/Mentor/{mentorId}/InternsDetails
//         public ActionResult<IEnumerable<User>> GetInternsDetails(string mentorId)
//         public ActionResult<IEnumerable<Intern>> GetInternsDetails(int mentorId)
//         {
//                 .Where(u => u.AssignedMentorId == mentorId)
//                 .Where(u => u.MentorId == mentorId)
//                 .SelectMany(u => u.Interns)
//                 .ToList();

//             if (interns == null || !interns.Any())
//             {
//                 return NotFound();
//             }

//             return Ok(interns);
//         }

//         // GET: api/Mentor/{mentorId}/InternsPocs
//         public ActionResult<IEnumerable<Poc>> GetInternsPocs(string mentorId)
//         public ActionResult<IEnumerable<Poc>> GetInternsPocs(int mentorId)
//         {
//             var pocs = _usersCollection.AsQueryable()
//                 .Where(u => u.MentorId == mentorId)
//                 .SelectMany(u => u.Pocs)
//                 .ToList();

//             if (pocs == null || !pocs.Any())
//             {
//                 return NotFound();
//             }

//             return Ok(pocs);
//         }
//     }
// }