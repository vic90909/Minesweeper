using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApi.Models
{
    public class MineSweeperContext:DbContext
    {
        public MineSweeperContext(DbContextOptions<MineSweeperContext> options)
            : base(options)
        {

        }

        public DbSet<MineSweeper> MineSweeperItems { get; set; }
    }
}
