using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Web.SessionState;
using System.DirectoryServices.AccountManagement;
using System.DirectoryServices;
using VisorADP.Models;
using VisorADP.DAL;
using VisorADP.Clases;
using WebMatrix.WebData;
using Postal;
using System.Security.Principal;
using System.Data.OleDb;
using System.Configuration;
using VisorADP.App_Start;
using System.Data.SqlClient;


namespace VisorADP.Controllers
{

    public class HomeController : Controller
    {
        FuncionesGenerales log = new FuncionesGenerales();

       
        public ActionResult Index()
        {
            //Usuario model = (Usuario)TempData["modelUsuario"];
            //return View(model); 
            return View();
        }

        

        public ViewResult ADPHome()
        {
            try
            {
               
                                
            }
            catch (Exception ex)
            {
                log.GuardarInfoEnLog(ex.Message);
                
            }           

            return View("ADPHome");
        }

        public ActionResult Login(Logueo loginModel)
        {
            try
            {
               
            }
            catch (Exception ex)
            {

                log.GuardarInfoEnLog(ex.Message);
            }


            return RedirectToAction("Index");
        }




      

    

        public ActionResult Register()
        {
            

            return RedirectToAction("ADPHome");
        }

    

      
       
        public JsonResult GetConfig()
        {
           
                var config = new
                {
                    precioPorHectarea = System.Configuration.ConfigurationManager.AppSettings["precioPorHectarea"],

                    /*MAP SERVER*/
                    urlMapServerProductor = System.Configuration.ConfigurationManager.AppSettings["urlMapServerProductor"],
                    urlMapServerAmbiente = System.Configuration.ConfigurationManager.AppSettings["urlMapServerAmbiente"],
                    urlMapServerPrescripcion = System.Configuration.ConfigurationManager.AppSettings["urlMapServerPrescripcion"],

                    /*FEATURE SERVER*/
                    urlFeatureLayerProductor = System.Configuration.ConfigurationManager.AppSettings["urlFeatureLayerProductor"],

                    urlGeometryService = System.Configuration.ConfigurationManager.AppSettings["urlGeometryService"],
                    urlServicioImpresion = System.Configuration.ConfigurationManager.AppSettings["urlServicioImpresion"],
                    urlMapaBase = System.Configuration.ConfigurationManager.AppSettings["urlMapaBase"]
                };

                return Json(config);
           

        }

       




     


     





      



      
     

      



      


    }
}
