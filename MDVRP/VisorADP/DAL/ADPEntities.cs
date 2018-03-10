using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using VisorADP.Models;

namespace VisorADP.DAL
{
    public class ADPEntities : DbContext
    {      
        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Orden> Ordenes { get; set; }

        public DbSet<Administrador> Administradores { get; set; }
        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        //}

        public DbSet<NumeroOperacionTarjeta> NumeroOperacionTarjetas { get; set; }


        public DbSet<Pago> Pagos { get; set; }


        public DbSet<Tecnico> Tecnicos { get; set; }
    }
}