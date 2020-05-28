using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages
{
    public class MaintenanceModel : PageModel
    {
        IAmazonS3 S3Client { get; set; }

        public MaintenanceModel(IAmazonS3 s3Client)
        {
            this.S3Client = s3Client;
        }

        public void OnGet()
        {
            UpdateServices();
        }

        private void UpdateServices()
        {
            List<int> siteIds = new List<int>();
            foreach (StreamingLiveLib.Service s in StreamingLiveLib.Services.LoadExpired())
            {
                if (!s.Recurring) StreamingLiveLib.Service.Delete(s.Id);
                else
                {
                    s.ServiceTime = s.ServiceTime.AddDays(7);
                    s.Save();
                    if (!siteIds.Contains(s.Id)) siteIds.Add(s.SiteId);
                }
            }

            if (siteIds.Count > 0)
            {
                foreach (StreamingLiveLib.Site site in StreamingLiveLib.Sites.Load(siteIds.ToArray()))
                {
                    Utils.WriteToS3(S3Client, $"data/{AppUser.Current.Site.KeyName}/data.json", site.LoadJson(), "application/json");
                }
            }
        }

    }
}