using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Common.Logging;
using WebMatrix.WebData;
using VisorADP.App_Start;

namespace VisorADP
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static ILog logger;
        static MvcApplication()
        {

            logger = LogManager.GetLogger("MVC4Admin");
            logger.Info("Log configurado.");
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            //Database.SetInitializer<dbADPDB>(new InitSecurityDb());
            //dbADPDB context = new ADPEntities();
            //context.Database.Initialize(true);
            //if (!WebSecurity.Initialized)
            //    WebSecurity.InitializeDatabaseConnection("DefaultConnection",
            //        "UserProfile", "UserId", "UserName", autoCreateTables: true);

            //DbContext dbCon = new VisorADP.DAL.ADPEntities();
            //if (!dbCon.Database.Exists())
            //{
            //    dbCon.Database.Create();
            //}

        }
    }
}