using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Clases
{
    public class Pedido
    {
        public int codigo { get; set; }
        public int codigo_cliente { get; set; }
        public string nombre { get; set; }
        public decimal latitud { get; set; }
        public decimal longitud { get; set; }
        public string direccion { get; set; }
        public string tipopedido { get; set; }
        public int carga { get; set; }
        public int vehiculo_bloqueado { get; set; }
        public int inhabilitado { get; set; }
    }
}