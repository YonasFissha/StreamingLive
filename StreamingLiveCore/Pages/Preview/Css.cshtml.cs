using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.Preview
{
    [EnableCors("CorsPolicy")]
    public class CssModel : PageModel
    {
        public string Output;

        public void OnGet()
        {
            StreamingLiveLib.Site site = StreamingLiveLib.Site.LoadByKeyName(Request.Query["key"]);
            Output = site.GetCss();
            Response.ContentType = "text/css";
        }
    }
}