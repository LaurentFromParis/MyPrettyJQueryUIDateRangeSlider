using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InnovacallCoreFramework.MVC.Controllers;
using DateRangeSliderDemoPortal.Models.ViewModels.LayoutViewModels;

namespace DateRangeSliderDemoPortal.Controllers
{
    public class HomeController : _CoreLayoutViewControllerBase<HomeLayoutViewModel>
    {
        public IActionResult Index()
        {
            StrongViewData._PageTitle = Resources.PortalCommon.View_Home_Index_PageTitle;
            return View(StrongViewData);
        }

        public IActionResult About()
        {
            StrongViewData._PageTitle = Resources.PortalCommon.View_Home_About_PageTitle;
            return View(StrongViewData);
        }

        public IActionResult Contact()
        {
            StrongViewData._PageTitle = Resources.PortalCommon.View_Home_Contact_PageTitle;
            return View(StrongViewData);
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
