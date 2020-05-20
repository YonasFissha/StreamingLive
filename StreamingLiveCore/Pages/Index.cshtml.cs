using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages
{
    public class IndexModel : PageModel
    {
        public string Title = "Hello World";

        public void OnGet()
        {
            int a = 0;
        }

        public void OnPost()
        {
            int a = 0;
        }

        
        public void OnPostTest()
        {
            int b = 0;
        }




    }
}