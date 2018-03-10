using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    public class DatosAmbienteResponse
    {

        public Int64 IdProductor { get; set; }
        public Double HSAlto { get; set; }
        public Double HSMedio { get; set; }
        public Double HSBajo { get; set; }

        public Double HSTotal { get; set; }

        public string Error { get; set; }
        public bool Exito { get; set; }

    }
}