using InnovacallCoreFramework.MVC.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace InnovacallCoreFramework.MVC.Controllers
{
    public class _CoreLayoutViewControllerBase<T> : Controller where T : _CoreLayoutViewModelBase
    {
        #region  Variables membres
        /// <summary>
        /// The _content data
        /// </summary>
        private T _strongViewData;
        #endregion

        /// <summary>
        /// Gets or sets the content data.
        /// </summary>
        /// <value>The content data.</value>
        /// <remarks></remarks>
        public T StrongViewData
        {
            get
            {
                return _strongViewData;
            }
            set
            {
                _strongViewData = value;
            }
        }

        public _CoreLayoutViewControllerBase()
        {
            this.StrongViewData = Activator.CreateInstance<T>();
        }
    }
}
