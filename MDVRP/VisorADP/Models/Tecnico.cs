using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    [Table("Tecnico")] 
    public class Tecnico
    {
        [Key]
        public Int64 id { get; set; }
        
        public string userid { get; set; }

        public string userpassword { get; set; }

        public string usermail { get; set; }

        public string usernombre { get; set; }

        public string userapellido { get; set; }

        public string userrol { get; set; }

        public string userdetalle { get; set; }
    }
}