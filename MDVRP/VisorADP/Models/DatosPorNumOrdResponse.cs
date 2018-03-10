using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    public class DatosPorNumOrdResponse
    {
        public Int64 IdProductor { get; set; }
        public string NombreProductor { get; set; }
        public string Celular { get; set; }

        public string Error { get; set; }
        public bool Exito { get; set; }

    }
}