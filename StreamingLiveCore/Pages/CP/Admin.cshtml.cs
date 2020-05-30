using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text;
using System.Data;
using Microsoft.AspNetCore.Authorization;

namespace StreamingLiveCore.Pages.CP
{
    public class AdminModel : PageModel
    {
        public string Upcoming = "";
        public StreamingLiveLib.Sites RecentSites;

        [BindProperty]
        public string SearchText { get; set; }



        public IActionResult OnGet()
        {

            if (!AppUser.Current.IsSiteAdmin) return Redirect("/cp/");
            else
            {
                PopulateUpcoming();
                RecentSites = StreamingLiveLib.Sites.LoadRecent();
                return this.Page();
            }
        }

        public IActionResult OnGetAccess()
        {
            int id = Convert.ToInt32(Request.Query["id"]);
            AppUser au = AppUser.Current;

            au.Site = StreamingLiveLib.Site.Load(id);
            au.Role = new StreamingLiveLib.Role() { Name = "admin", SiteId = id, UserId = AppUser.Current.UserData.Id };
            AppUser.Current = au;
            return Redirect("/cp/");
        }

        public void OnPostSearch()
        {
            RecentSites = StreamingLiveLib.Sites.Search(SearchText);
            PopulateUpcoming();
        }

        private void PopulateUpcoming()
        {
            StringBuilder sb = new StringBuilder();
            DataTable dt = StreamingLiveLib.Services.LoadUpcoming();
            foreach (DataRow row in dt.Rows)
            {
                DateTime serviceTime = Convert.ToDateTime(row["ServiceTime"]).AddHours(-5);
                sb.Append($"<tr><td><a href=\"https://{row["KeyName"]}.streaminglive.church/\" target=\"_blank\">{row["KeyName"]}</a></td><td>{serviceTime}</td></tr>");
            }
            Upcoming = sb.ToString();
        }

        



    }
}