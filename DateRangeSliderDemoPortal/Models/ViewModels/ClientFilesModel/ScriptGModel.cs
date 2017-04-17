using System;
using System.Collections.Generic;
using System.Linq;

namespace DateRangeSliderDemoPortal.Models.ViewModels.ClientFilesViewModels
{
    public class ScriptGModel
    {
        public Dictionary<string, object> Variables { get; set; }
        public ScriptGModel()
        {
            Variables = new Dictionary<string, object>();
        }
    }
}