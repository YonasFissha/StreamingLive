using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Admin
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!AppUser.Current.IsSiteAdmin) Response.Redirect("/cp/");
            if (!IsPostBack)
            {
                PopulateUpcoming();
                PopulateRecent();
            }
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
            UpcomingLit.Text = sb.ToString();
        }

        private void PopulateRecent()
        {
            SiteRepeater.DataSource = StreamingLiveLib.Sites.LoadRecent();
            SiteRepeater.DataBind();
        }

        protected void SiteRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName=="Access")
            {
                int siteId = Convert.ToInt32(e.CommandArgument);
                AppUser.Current.Site = StreamingLiveLib.Site.Load(siteId);
                AppUser.Current.Role = new StreamingLiveLib.Role() { Name = "admin", SiteId = siteId, UserId = AppUser.Current.UserData.Id };
                Response.Redirect("/cp/");
            }
        }

        protected void SiteRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            StreamingLiveLib.Site s = (StreamingLiveLib.Site)e.Item.DataItem;
            LinkButton AccessLink = (LinkButton)e.Item.FindControl("AccessLink");
            AccessLink.CommandArgument = s.Id.ToString();
        }

        protected void SearchButton_Click(object sender, EventArgs e)
        {
            SiteRepeater.DataSource = StreamingLiveLib.Sites.Search(SearchText.Text);
            SiteRepeater.DataBind();
        }
    }
}