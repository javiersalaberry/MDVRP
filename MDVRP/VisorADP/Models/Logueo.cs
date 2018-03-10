using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace VisorADP.Models
{
    public class Logueo
    {      
        [Required(ErrorMessage = "Ingrese un nombre de usuario")]       
        [Display(Name = "Usuario")]
        public string NombreUsuario { get; set; }
            

        [DataType(DataType.Password)]      
        [Required(ErrorMessage = "Ingrese una contraseña")]
        public string Password { get; set; }

    }
}