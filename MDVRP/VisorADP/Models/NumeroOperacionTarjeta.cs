using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    [Table("NumeroOperacionTarjeta")] 
    public class NumeroOperacionTarjeta
    {
        [Key]
        public Int64 NumeroOperacion { get; set; }       

        public Int64 IdProductor { get; set; }

        public Int16 Pago { get; set; }

        public virtual ICollection<Pago> Pagos { get; set; }

    }
}