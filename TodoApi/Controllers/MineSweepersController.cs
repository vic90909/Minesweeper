using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/MineSweeper")]
    [ApiController]
    public class MineSweepersController : ControllerBase
    {
        private readonly MineSweeperContext _context;

        public MineSweepersController(MineSweeperContext context)
        {
            _context = context;
        }

        // GET: api/MineSweepers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MineSweeper>>> GetMineSweeperItems()
        {
            return await _context.MineSweeperItems.ToListAsync();
        }

        // GET: api/MineSweepers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MineSweeper>> GetMineSweeper(long id)
        {
            var mineSweeper = await _context.MineSweeperItems.FindAsync(id);

            if (mineSweeper == null)
            {
                return NotFound();
            }

            return mineSweeper;
        }

        // PUT: api/MineSweepers/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMineSweeper(long id, MineSweeper mineSweeper)
        {
            if (id != mineSweeper.id)
            {
                return BadRequest();
            }

            _context.Entry(mineSweeper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MineSweeperExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MineSweepers
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<MineSweeper>> PostMineSweeper(MineSweeper mineSweeper)
        {
            _context.MineSweeperItems.Add(mineSweeper);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMineSweeper), new { id = mineSweeper.id }, mineSweeper);
        }

        // DELETE: api/MineSweepers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MineSweeper>> DeleteMineSweeper(long id)
        {
            var mineSweeper = await _context.MineSweeperItems.FindAsync(id);
            if (mineSweeper == null)
            {
                return NotFound();
            }

            _context.MineSweeperItems.Remove(mineSweeper);
            await _context.SaveChangesAsync();

            return mineSweeper;
        }

        private bool MineSweeperExists(long id)
        {
            return _context.MineSweeperItems.Any(e => e.id == id);
        }
    }
}
