using InnovacallCoreFramework.MVC.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace InnovacallCoreFramework.MVC.Controllers
{
    public class _CoreLayoutViewControllerBase<T> : Controller where T: _CoreLayoutViewModelBase
    {
    }
}
