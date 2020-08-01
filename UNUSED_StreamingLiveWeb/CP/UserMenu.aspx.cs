using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP
{
    public partial class UserMenu : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string mode = Request["mode"];
            if (mode == "select") SelectSite();
            else OutputSites();
        }

        private void SelectSite()
        {
            int id = Convert.ToInt32(Request["id"]);
            AppUser.Current.Site = AppUser.Current.Sites.GetById(id);
        }

        private void OutputSites()
        {
            if (AppUser.Current.Sites.Count>1)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("<div class=\"label divider\">Switch Site</div><div id=\"userSites\">");
                foreach (StreamingLiveLib.Site s in AppUser.Current.Sites) sb.Append($"<a href=\"javascript:selectSite({s.Id})\"><i class=\"fas fa-user\"></i> {s.KeyName}</a>");
                sb.Append("</div>");
                OutputLit.Text = sb.ToString();
            }

            
        }

    }
}