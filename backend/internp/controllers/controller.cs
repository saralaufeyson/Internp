using Microsoft.AspNetCore.Mvc;

namespace InternApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Controller : ControllerBase
    {
       
        // GET: api/controller
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello, World!");
        }

        // GET: api/controller/{id}
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            return Ok($"Hello, World! ID: {id}");
        }

        // POST: api/controller
        [HttpPost]
        public IActionResult Post([FromBody] object value)
        {
            return CreatedAtAction(nameof(Get), new { id = 1 }, value);
        }

        // PUT: api/controller/{id}
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] object value)
        {
            return NoContent();
        }

        // DELETE: api/controller/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}