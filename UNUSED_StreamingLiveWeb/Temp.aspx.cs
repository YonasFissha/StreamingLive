using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb
{
    public partial class Temp : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //foreach (StreamingLiveLib.Site site in StreamingLiveLib.Sites.LoadAll()) MigrateSite(site);
            //GenerateJson();
        }


        private void GenerateJson()
        {
            StreamingLiveLib.Sites sites = StreamingLiveLib.Sites.Load("select * from sites WHERE id in (select distinct(siteid) from services)");
            foreach (StreamingLiveLib.Site s in sites)
            {
                System.IO.File.WriteAllText(Server.MapPath("/data/" + s.KeyName + "/data.json"), s.LoadJson());
            }

        }

        private void MigrateSite(StreamingLiveLib.Site site)
        {
            if (site.KeyName == "localhost3") return;
            string jsonData = StreamingLiveLib.Utils.GetJson(CachedData.BaseUrl + "/data/" + site.KeyName + "/preview.json");
            JObject data = JObject.Parse(jsonData);
            
            JObject colors = (JObject)data["colors"];
            site.ContrastColor = colors["contrast"].ToString();
            site.PrimaryColor = colors["primary"].ToString();
            site.HeaderColor = colors["header"].ToString();

            JObject logo = (JObject)data["logo"];
            site.HomePageUrl = logo["url"].ToString();
            site.LogoUrl = logo["image"].ToString();

            site.Save();
            
            int i = 1;
            JArray buttons = (JArray)data["buttons"];
            foreach (JObject b in buttons)
            {
                new StreamingLiveLib.Button() { SiteId = site.Id, Sort = i, Text = b["text"].ToString(), Url = b["url"].ToString() }.Save();
                i++;
            }

            i = 1;
            JArray tabs = (JArray)data["tabs"];
            foreach (JObject t in tabs)
            {
                new StreamingLiveLib.Tab() { SiteId = site.Id, Sort = i, Icon=Convert.ToString(t["icon"]), TabData=Convert.ToString(t["data"]), TabType=Convert.ToString(t["type"]), Text=Convert.ToString(t["text"]), Url=Convert.ToString(t["text"]) }.Save();
                i++;
            }

            i = 1;
            JArray services = (JArray)data["services"];
            foreach (JObject s in services)
            {
                DateTime serviceTime=DateTime.MinValue;
                DateTime.TryParse(Convert.ToString(s["serviceTime"]), out serviceTime);

                StreamingLiveLib.Service service = new StreamingLiveLib.Service() {
                    SiteId = site.Id,
                    ChatAfter = StreamingLiveLib.Utils.GetTotalSeconds(Convert.ToString(s["chatAfter"])),
                    ChatBefore = StreamingLiveLib.Utils.GetTotalSeconds(Convert.ToString(s["chatBefore"])),
                    Duration = StreamingLiveLib.Utils.GetTotalSeconds(Convert.ToString(s["duration"])),
                    EarlyStart = StreamingLiveLib.Utils.GetTotalSeconds(Convert.ToString(s["earlyStart"])),
                    Provider = Convert.ToString(s["provider"]),
                    ProviderKey = Convert.ToString(s["providerKey"]),
                    VideoUrl = Convert.ToString(s["videoUrl"]),
                    ServiceTime = serviceTime
                };
                
                if (service.ServiceTime>DateTime.Today) service.Save();
                i++;
            }


        }

    }
}