using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InnovacallCoreFramework.MVC.Controllers;
using DateRangeSliderDemoPortal.Models.ViewModels.LayoutViewModels;
using DateRangeSliderDemoPortal.Models.ViewModels.ClientFilesViewModels;

namespace DateRangeSliderDemoPortal.Controllers
{
    public class ScriptsGController : Controller
    {
        protected ScriptGModel Model;
        [Produces("text/javascript")]
        public ActionResult Home()
        {
            Model = new ScriptGModel();
            InitModel();
            Model.Variables.Add("scriptGLoaded", "true");
            return View(Model);
        }
        private void InitModel()
        {
            Model.Variables.Add("transNotImplemented",Resources.PortalCommon.ViewAll_FeatureNotImplemented);
        }
    }
}
