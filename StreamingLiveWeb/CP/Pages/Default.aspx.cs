using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Pages
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");

            if (!IsPostBack) Populate();
        }

        private void Populate()
        {
            StreamingLiveLib.Pages pages = StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id.Value);
            PageRepeater.DataSource = pages;
            PageRepeater.DataBind();
            NoPagesLit.Visible = pages.Count == 0;

            PageListHolder.Visible = true;
            PageEditHolder.Visible = false;
        }


        protected void PageRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            int pageId = Convert.ToInt32(e.CommandArgument);
            ShowEditPage(pageId);
        }

        protected void PageRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            StreamingLiveLib.Page page = (StreamingLiveLib.Page)e.Item.DataItem;
            LinkButton EditLink = (LinkButton)e.Item.FindControl("EditLink");
            EditLink.CommandArgument = page.Id.ToString();
        }

        private void ShowEditPage(int pageId)
        {
            SaveButton.Attributes.Add("onclick", "setBodyValue()");
            StreamingLiveLib.Page page = (pageId == 0) ? new StreamingLiveLib.Page() : StreamingLiveLib.Page.Load(pageId);
            NameText.Text = page.Name;
            PageIdHid.Value = pageId.ToString();
            if (pageId > 0)
            {
                string htmlFile = Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/page" + page.Id + ".html");
                if (System.IO.File.Exists(htmlFile))
                {
                    BodyHid.Value = System.IO.File.ReadAllText(htmlFile);
                    BodyHid.Value = System.Text.RegularExpressions.Regex.Match(BodyHid.Value, "<body>.*</body>").Value.Replace("<body>", "").Replace("</body>", "");
                }
                DeleteButton.Attributes.Add("onclick", "return confirm('Are you sure you wish to delete this page?')");
                DeleteHolder.Visible = true;
            }
            else DeleteHolder.Visible = false;

            PageListHolder.Visible = false;
            PageEditHolder.Visible = true;
        }

        protected void DeleteButton_Click(object sender, EventArgs e)
        {
            int pageId = Convert.ToInt32(PageIdHid.Value);
            StreamingLiveLib.Page page = (pageId == 0) ? new StreamingLiveLib.Page() : StreamingLiveLib.Page.Load(pageId);
            string htmlFile = Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/page" + page.Id + ".html");
            System.IO.File.Delete(htmlFile);
            StreamingLiveLib.Page.Delete(pageId);
            Populate();
        }

        protected void CancelButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void SaveButton_Click(object sender, EventArgs e)
        {
            int pageId = Convert.ToInt32(PageIdHid.Value);
            StreamingLiveLib.Page page = (pageId == 0) ? new StreamingLiveLib.Page() : StreamingLiveLib.Page.Load(pageId);
            page.Name = NameText.Text;
            page.LastModified = DateTime.UtcNow;
            page.SiteId = AppUser.Current.Site.Id;
            page.Save();

            string cssLink = "<link href=\"/data/" + AppUser.Current.Site.KeyName + "/data.css\" rel=\"stylesheet\">"
                + "<link href=\"/css/page.css\" rel=\"stylesheet\">";

            cssLink = "<link href=\"/css/page.css\" rel=\"stylesheet\">";

            string htmlFile = Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/page" + page.Id + ".html");
            System.IO.File.WriteAllText(htmlFile, $"<html><head>{cssLink}</head><body>{BodyHid.Value}</body></html>");


            Populate();
        }

        protected void AddPageLink_Click(object sender, EventArgs e)
        {
            ShowEditPage(0);
        }
    }
}