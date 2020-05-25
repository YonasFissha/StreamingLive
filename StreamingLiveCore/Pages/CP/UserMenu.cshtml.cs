using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.CP
{
    public class UserMenuModel : PageModel
    {
        public string AccountsHtml;

        public void OnGet()
        {
            OutputSites();
        }

        public void OnGetSelect()
        {
            int id = Convert.ToInt32(Request.Query["id"]);
            AppUser au = AppUser.Current;
            au.Site = au.Sites.GetById(id);
            AppUser.Current= au;
        }

        private void OutputSites()
        {
            if (AppUser.Current.Sites.Count > 1)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("<div class=\"label divider\">Switch Site</div><div id=\"userSites\">");
                foreach (StreamingLiveLib.Site s in AppUser.Current.Sites) sb.Append($"<a href=\"javascript:selectSite({s.Id})\"><i class=\"fas fa-user\"></i> {s.KeyName}</a>");
                sb.Append("</div>");
                AccountsHtml = sb.ToString();
            }


        }

    }
}