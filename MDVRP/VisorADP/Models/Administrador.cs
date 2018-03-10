using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VisorADP.Models
{
    [Table("Administrador")]
    public class Administrador
    {       
        [Key]   
        public string Password { get; set; }
    }
}