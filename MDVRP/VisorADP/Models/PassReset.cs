using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace VisorADP.Models
{
    public class PassReset    {

        [Required(ErrorMessage = "La dirección de email es obligatoria")]
        [EmailAddress(ErrorMessage = "El mail ingresado no es válido")]
        public string Email { get; set; }

        [DataType(DataType.Password)]
       // [Remote("CompararUserPass", "Home", ErrorMessage = "La contraseña no puede ser igual al nombre de usuario", AdditionalFields = "NombreUsuario")]
        [Required(ErrorMessage = "La contraseña es obligatoria y no puede estar en blanco")]
        public string Password { get; set; }

        [NotMapped]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "La confirmación de contraseña es obligatoria")]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "La contraseña y su confirmación no son iguales")]
        [Display(Name = "Confirmación")]
        public string PasswordConfirmacion { get; set; }

        public string VCode { get; set; }
    }
}