using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb
{
    public partial class Maintenance : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
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

            if (siteIds.Count>0)
            {
                foreach (StreamingLiveLib.Site site in StreamingLiveLib.Sites.Load(siteIds.ToArray()))
                {
                    System.IO.File.WriteAllText(Server.MapPath("/data/" + site.KeyName + "/data.json"), site.LoadJson());
                }
            }
        }

    }
}