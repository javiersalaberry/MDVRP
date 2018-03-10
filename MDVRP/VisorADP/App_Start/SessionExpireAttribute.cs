using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VisorADP.App_Start
{
    public class SessionExpireAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            // check  sessions here
            if (HttpContext.Current.Session["UsuarioNombre"] == null)
            {
                filterContext.Result = new RedirectResult("~/Home/ADPHome");
                return;
            }
            base.OnActionExecuting(filterContext);
        }
    }
}