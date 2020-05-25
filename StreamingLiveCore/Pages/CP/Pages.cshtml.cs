using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.CP
{
    public class PagesModel : PageModel
    {
        public StreamingLiveLib.Pages Pages;
        public StreamingLiveLib.Page SelectedPage;
        IAmazonS3 S3Client { get; set; }

        [BindProperty]
        public string Name { get; set; }

        [BindProperty]
        public int PageId { get; set; }

        [BindProperty]
        public string PageBody { get; set; }


        public PagesModel(IAmazonS3 s3Client)
        {
            this.S3Client = s3Client;
        }

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
                try
                {
                    PageBody = Utils.GetUrlContents(CachedData.ContentUrl + $"/data/{AppUser.Current.Site.KeyName}/page{SelectedPage.Id}.html");
                    PageBody = System.Text.RegularExpressions.Regex.Match(PageBody, "<body>.*</body>").Value.Replace("<body>", "").Replace("</body>", "");
                } catch
                {
                    PageBody = "";
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
            S3Client.DeleteAsync(CachedData.S3ContentBucket, $"data/{AppUser.Current.Site.KeyName}/page{page.Id}.html", null).Wait();
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

            Utils.WriteToS3(S3Client, $"data/{AppUser.Current.Site.KeyName}/page{page.Id}.html", $"<html><head>{cssLink}</head><body>{PageBody}</body></html>", "text/html");
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