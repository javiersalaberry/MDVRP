using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace VisorADP.Models
{
    [Table("Usuario")] 
    public class Usuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { get; set; }

        [StringLength(30, ErrorMessage = "El nombre de usuario tiene que tener de 6 a 30 caracteres", MinimumLength = 6)]
        [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
        [RegularExpression(@"^[a-zA-Z0-9_\.]+$", ErrorMessage = "El nombre de usuario solo puede tener caracteres alfabéticos, numéricos, infraguión o punto")]
        [Remote("ExisteUsuario", "Home", ErrorMessage = "El nombre de usuario ya existe")]
        [Display(Name = "Usuario")]       
        public string NombreUsuario { get; set; }

        [Required(ErrorMessage = "La dirección de email es obligatoria")]
        [EmailAddress(ErrorMessage = "El mail ingresado no es válido")]        
        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Remote("CompararUserPass", "Home", ErrorMessage = "La contraseña no puede ser igual al nombre de usuario", AdditionalFields = "NombreUsuario")]
        [Required(ErrorMessage = "La contraseña es obligatoria y no puede estar en blanco")]       
        public string Password { get; set; }

        [NotMapped]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "La confirmación de contraseña es obligatoria")]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "La contraseña y su confirmación no son iguales")]
        [Display(Name = "Confirme")]
        public string PasswordConfirmacion { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombres { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio")]
        public string Apellidos { get; set; }

        [Required(ErrorMessage = "El celular es obligatorio")]
        [RegularExpression(@"^[Z0-9()]+$", ErrorMessage = "El celular debe ser numérico")]
        public string Celular { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        [RegularExpression(@"^[Z0-9]+$", ErrorMessage = "El teléfono debe ser numérico")]
        [Display(Name = "Teléfono")]
        public string Telefono { get; set; }

        [Display(Name = "Razón Social")]
        public string RazonSocial { get; set; }

        [Required(ErrorMessage = "El CUIT es obligatorio")]
        [RegularExpression(@"^[Z0-9.]+$", ErrorMessage = "El CUIT solo puede tener caracteres numéricos o punto")]
        [Display(Name = "CUIT")]
        public string Cuit { get; set; }



        [Required(ErrorMessage = "La dirección es obligatorio")]
        [Display(Name = "Dirección")]
        public string Direccion { get; set; }

        [Required(ErrorMessage = "La ciudad es obligatorio")]
        public string Ciudad { get; set; }

        [Required(ErrorMessage = "El departamento es obligatorio")]
        public string Departamento { get; set; }

        [Required(ErrorMessage = "El país es obligatorio")]
        public string Pais { get; set; }

        public string Establecimiento { get; set; }
               
        [Required(ErrorMessage = "Respuesta errónea")]       
        [Remote("CaptchaSuma", "Home", ErrorMessage = "Respuesta errónea", AdditionalFields = "CaptchaConfirm")]   
        [NotMapped] 
        public string Captcha { get; set; }
        [NotMapped] 
        public string CaptchaConfirm { get; set; }

        [NotMapped]
        public string TipoUsuario { get; set; }  

        public string VCode { get; set; }

        public string EmailConfCode { get; set; }
        [Display(Name = "Código Postal")]
        public string codpostal { get; set; }
    }



    //[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    //public class UnlikeAttribute : ValidationAttribute
    //{
    //    private const string DefaultErrorMessage = "El valor de {0} no puede ser igual al valor de {1}.";

    //    public string OtherProperty { get; private set; }

    //    public UnlikeAttribute(string otherProperty)
    //        : base(DefaultErrorMessage)
    //    {
    //        if (string.IsNullOrEmpty(otherProperty))
    //        {
    //            throw new ArgumentNullException("otherProperty");
    //        }

    //        OtherProperty = otherProperty;
    //    }

    //    public override string FormatErrorMessage(string name)
    //    {
    //        return string.Format(ErrorMessageString, name, OtherProperty);
    //    }

    //    protected override ValidationResult IsValid(object value,
    //        ValidationContext validationContext)
    //    {
    //        if (value != null)
    //        {
    //            var otherProperty = validationContext.ObjectInstance.GetType()
    //                .GetProperty(OtherProperty);

    //            var otherPropertyValue = otherProperty
    //                .GetValue(validationContext.ObjectInstance, null);

    //            if (value.Equals(otherPropertyValue))
    //            {
    //                return new ValidationResult(
    //                    FormatErrorMessage(validationContext.DisplayName));
    //            }
    //        }

    //        return ValidationResult.Success;
    //    }
    //}
}


//using System.Web.Mvc;  
//namespace RemoteValidation.Models   
//{  
//    public class UserViewModel   
//    {  
//        public string UserName   
//        {  
//            get;  
//            set;  
//        }  
//        public string Email   
//        {  
//            get;  
//            set;  
//        }  
//    }  
//}  