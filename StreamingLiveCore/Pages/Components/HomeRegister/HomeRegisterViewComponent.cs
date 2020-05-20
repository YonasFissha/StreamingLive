using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamingLiveCore.Pages.Components.ViewComponents
{
    public class HomeRegisterViewComponent : ViewComponent
    {
        public string KeyName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public IViewComponentResult Invoke()
        {
            return View(this);
        }

        public void OnPost()
        {
            Email = "Hello World";
        }

        public void OnPostRegister()
        {
            Email = "Hello World";
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IViewComponentResult Register()
        {
            Email = "Hello World";
            return View(this);
        }


    }
}
