using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;
namespace VisorADP.Models
{
    [Table("Orden")] 
    public class Orden
    {
        
        [Key]
        public Int64 NumeroOrden { get; set; }

        public DateTime FechaOrden { get; set; }
      
        public Int64 IdProductor { get; set; }
    }
}