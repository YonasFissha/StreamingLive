using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.CP
{
    public class PagesModel : PageModel
    {
        public StreamingLiveLib.Pages Pages;
        public StreamingLiveLib.Page SelectedPage;
        
        [BindProperty]
        public string Name { get; set; }

        [BindProperty]
        public int PageId { get; set; }

        [BindProperty]
        public string PageBody { get; set; }

        public void OnGet()
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            Populate();
        }

        private void Populate()
        {
            Pages = StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id);
        }

        private void ShowEditPage()
        {
            Populate();  //***Is there a better way to keep the model populated?
            int pageId = Convert.ToInt32(Request.Query["Id"]);

            SelectedPage = (pageId == 0) ? new StreamingLiveLib.Page() : StreamingLiveLib.Page.Load(pageId);
            if (pageId > 0)
            {
                string htmlFile = Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/page" + SelectedPage.Id + ".html");
                if (System.IO.File.Exists(htmlFile))
                {
                    PageBody = System.IO.File.ReadAllText(htmlFile);
                    PageBody = System.Text.RegularExpressions.Regex.Match(PageBody, "<body>.*</body>").Value.Replace("<body>", "").Replace("</body>", "");
                }
                Name = SelectedPage.Name;
                PageId = SelectedPage.Id;
            } else
            {
                PageId = 0;
                PageBody = "";
                Name = "";
            }
        }

        public void OnPostDelete()
        {
            StreamingLiveLib.Page page = StreamingLiveLib.Page.Load(PageId);
            string htmlFile = Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/page" + page.Id + ".html");
            System.IO.File.Delete(htmlFile);
            StreamingLiveLib.Page.Delete(PageId);
            Populate();
        }

        public void OnPostCancel()
        {
            Populate();
        }

        public void OnPostSave()
        {
            StreamingLiveLib.Page page = (PageId == 0) ? new StreamingLiveLib.Page() : StreamingLiveLib.Page.Load(PageId);
            page.Name = Name;
            page.LastModified = DateTime.UtcNow;
            page.SiteId = AppUser.Current.Site.Id;
            page.Save();

            string cssLink = "<link href=\"/data/" + AppUser.Current.Site.KeyName + "/data.css\" rel=\"stylesheet\">" 
                + "<link href=\"/css/page.css\" rel=\"stylesheet\">";

            string htmlFile = Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/page" + page.Id + ".html");
            System.IO.File.WriteAllText(htmlFile, $"<html><head>{cssLink}</head><body>{PageBody}</body></html>");
            Populate();
        }

        public void OnGetAdd()
        {
            ShowEditPage();
        }

        public void OnGetEdit()
        {
            ShowEditPage();
        }


    }
}