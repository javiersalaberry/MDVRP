using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    public class Prescripcion
    {
        public long IdProductor { get; set; }
        public long IdCapa { get; set; }
        public string NombreCapa {get; set;}

        public string Fert1 {get; set;}
        public string Fert2 {get; set;}
        public string Fert3 {get; set;}

        public double Alto1 { get; set; }
        public double Alto2 { get; set; }
        public double Alto3 { get; set; }
        public double Alto4 { get; set; }

        public double Medio1 { get; set; }
        public double Medio2 { get; set; }
        public double Medio3 { get; set; }
        public double Medio4 { get; set; }

        public double Bajo1 { get; set; }
        public double Bajo2 { get; set; }
        public double Bajo3 { get; set; }
        public double Bajo4 { get; set; }

        public double Total1 { get; set; }
        public double Total2 { get; set; }
        public double Total3 { get; set; }
        public double Total4 { get; set; }

        public double Prom1 { get; set; }
        public double Prom2 { get; set; }
        public double Prom3 { get; set; }


    }
}