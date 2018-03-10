using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VisorADP.Models
{
    public class Olvido
    {
        [Required(ErrorMessage = "La dirección de email es obligatoria")]
        [EmailAddress(ErrorMessage = "El mail ingresado no es válido")]     
        public string Email { get; set; }
    }
}