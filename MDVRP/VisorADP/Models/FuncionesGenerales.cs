using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    public class FuncionesGenerales
    {
        public void GuardarInfoEnLog(Exception ex)
        {
            String page = GetFunctionPage(ex);
            String funcion = GetFunctionName(ex);
            String mensaje = ex.Message;
            if (funcion == null)
            {
                funcion = "";
            }
            if (page == null)
            {
                page = "";
            }
            if (mensaje == null)
            {
                mensaje = "";
            }
            else
            {
                String resultado = "PAGINA: " + page + " - FUNCION: " + funcion + " - ERROR: " + mensaje;
                MvcApplication.logger.Error(resultado);
            }
        }

        public void GuardarInfoEnLog(String mensaje)
        {
            MvcApplication.logger.Error(mensaje);
        }

        public String GetFunctionName(Exception ex)
        {
            String _functionName = "";
            try
            {
                String[] stackStr = ex.StackTrace.Replace(" at ", "|").Split('|');
                String functionStr = "";

                if (stackStr.Length > 0)
                    functionStr = stackStr[stackStr.Length - 1];
                int inicio = functionStr.IndexOf(".");
                int fin = functionStr.IndexOf("(");
                String functionNameAux = functionStr;

                if (functionNameAux.Length > 256)
                    functionNameAux = functionStr.Substring(1, 256);

                if (inicio < fin)
                    functionNameAux = functionStr.Substring(inicio + 1, fin - inicio - 1);

                return functionNameAux;
            }
            catch
            {

            }
            return _functionName;

        }


        public string GetFunctionPage(Exception ex)
        {
            String functionStr = "";
            String functionpage = "";
            try
            {
                String[] stackStr = ex.StackTrace.Replace(" at ", "|").Split('|');

                if (stackStr.Length > 0)
                    functionStr = stackStr[stackStr.Length - 1];
                int inicio = functionStr.IndexOf(".");
                int fin = functionStr.IndexOf("(");
                String functionName = functionStr;

                if (functionName.Length > 256)
                    functionName = functionStr.Substring(1, 256);

                if (inicio < fin)
                    functionName = functionStr.Substring(inicio + 1, fin - inicio - 1);



                String[] arrays = functionName.Split('.');

                if (arrays.Length > 0)
                {
                    for (int i = 0; i <= 0; i++)
                    {
                        functionpage += "/" + arrays[i];
                    }
                }

                return functionpage;
            }
            catch
            {

            }
            return functionpage;
        }

    }
}