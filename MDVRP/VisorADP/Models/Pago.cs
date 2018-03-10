using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    [Table("Pago")] 
    public class Pago
    {

        [Key]
        public Int64 id { get; set; }

        public long IdProductor { get; set; }

        public long OIDArea { get; set; }

        public string Establecimiento { get; set; }

        public double Area { get; set; }

        public double Precio { get; set; }

        public DateTime Fecha { get; set; }

        public long NumeroOrden { get; set; }

        public string UrlKmz { get; set; }


        //Foreign key for Standard
        public Int64 NumeroOperacion { get; set; }

        [ForeignKey("NumeroOperacion")]
        public NumeroOperacionTarjeta NumeroOperacionTarjeta { get; set; }

    }
}