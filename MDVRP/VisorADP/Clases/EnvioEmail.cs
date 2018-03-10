using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Net.Mail.MailMessege;
//using System.Net.Mail.MailAddress;
//using System.Net.Mail.SmtpClient;

namespace BLL
{
    public class EnvioEmail
    {
        public static void EnviarCorreo(string emailUsuario, string nombreUsuario, string password)
        {
            /*-------------------------MENSAJE DE CORREO----------------------*/

            //Creamos un nuevo Objeto de mensaje
            System.Net.Mail.MailMessage mmsg = new System.Net.Mail.MailMessage();

            //Direccion de correo electronico a la que queremos enviar el mensaje
            mmsg.To.Add(emailUsuario);

            //Nota: La propiedad To es una colección que permite enviar el mensaje a más de un destinatario

            //Asunto
            mmsg.Subject = "Clinica Dental Dra.Cecilia Coiro-recuperación contraseña";
            mmsg.SubjectEncoding = System.Text.Encoding.UTF8;

            //Direccion de correo electronico que queremos que reciba una copia del mensaje
            //mmsg.Bcc.Add("destinatariocopia@servidordominio.com"); //Opcional

            //Cuerpo del Mensaje
            mmsg.Body = "Su nombre de usuario es: " + nombreUsuario + "\n" +
                        "Su contraseña es: " + password;
            mmsg.BodyEncoding = System.Text.Encoding.UTF8;
            mmsg.IsBodyHtml = false; //Si no queremos que se envíe como HTML

            //Correo electronico desde la que enviamos el mensaje
            mmsg.From = new System.Net.Mail.MailAddress("r.pintos.banchero@gmail.com");


            /*-------------------------CLIENTE DE CORREO----------------------*/

            //Creamos un objeto de cliente de correo
            System.Net.Mail.SmtpClient cliente = new System.Net.Mail.SmtpClient();

            //Hay que crear las credenciales del correo emisor
            //cliente.Credentials = new System.Net.NetworkCredential("r.pintos.banchero@gmail.com", "passworddeestemail");

            //Lo siguiente es obligatorio si enviamos el mensaje desde Gmail

            cliente.Port = 587;
            cliente.EnableSsl = true;


            cliente.Host = "smtp.gmail.com"; //Para Gmail "smtp.gmail.com";

            /*-------------------------ENVIO DE CORREO----------------------*/

            try
            {
                //Enviamos el mensaje      
                cliente.Send(mmsg);
            }
            catch (System.Net.Mail.SmtpException ex)
            {
                throw new Exception("No se pudo enviar el email");
            }
        }
    }
}
