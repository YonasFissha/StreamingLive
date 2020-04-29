using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;

namespace StreamingLiveWeb.CP.Live
{
    public partial class Default : System.Web.UI.Page
    {
        public string PreviewUrl = "http://localhost:201/?preview=1";
       

        public string JsonData
        {
            get { return (string)ViewState["jsondata"]; }
            set { ViewState["jsondata"] = value; }
        }
        JObject data;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");

            if (!IsPostBack) LoadData();
            data = JObject.Parse(JsonData);
            CleanData();

            if (CachedData.Environment=="prod") PreviewUrl = "https://" + AppUser.Current.Site.KeyName + ".streaminglive.church/?preview=1";
            string liveUrl = "https://" + AppUser.Current.Site.KeyName + ".streaminglive.church/";
            LiveLinkLit.Text = $"<p style=\"margin-top:10px;margin-bottom:0px;\">View your live site: <a href=\"{liveUrl}\" target=\"_blank\">{liveUrl}</a></p>";


            AppearanceEditor1.Data = data;
            AppearanceEditor1.DataUpdated += AppearanceEditor1_DataUpdated;

            ButtonEditor1.Data = data;
            ButtonEditor1.DataUpdated += ButtonEditor1_DataUpdated;

            TabEditor1.Data = data;
            TabEditor1.DataUpdated += TabEditor1_DataUpdated;

            if (!IsPostBack) Populate();
        }

        private void AppearanceEditor1_DataUpdated(object sender, EventArgs e)
        {
            data = AppearanceEditor1.Data;
            UpdateData();
        }

        private void ButtonEditor1_DataUpdated(object sender, EventArgs e)
        {
            data = ButtonEditor1.Data;
            UpdateData();
        }

        private void CleanData()
        {
            JArray tabs = (JArray)data["tabs"];
            foreach (JObject tab in tabs) if (tab["icon"] == null) tab["icon"] = "";
        }

        private void TabEditor1_DataUpdated(object sender, EventArgs e)
        {
            data = TabEditor1.Data;
            UpdateData();
        }

        private void Populate()
        {

            UpdateConfigHolder.Visible = false;

            

            JArray services = (JArray)data["services"];
            ServiceRepeater.DataSource = services;
            ServiceRepeater.DataBind();
            NoServicesLit.Visible = services.Count == 0;

            ServiceEditHolder.Visible = false;
            ServiceListHolder.Visible = true;

            AppearanceEditor1.Populate();
            ButtonEditor1.Populate();
            TabEditor1.Populate();
        }


        private void LoadData()
        {
            JsonData = StreamingLiveLib.Utils.GetJson(CachedData.BaseUrl + "/data/" + AppUser.Current.Site.KeyName + "/preview.json");
        }

        

        private void UpdateData()
        {
            JsonData = data.ToString(Formatting.None);
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.json"), JsonData);
            Populate();
        }

        

        protected void PublishButton_Click(object sender, EventArgs e)
        {
            JsonData = data.ToString(Formatting.None);
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.json"), JsonData);
            System.IO.File.Copy(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.css"), Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.css"), true);

            UpdateConfigHolder.Visible = true;

        }


        protected void SaveServiceButton_Click(object sender, EventArgs e)
        {

            string earlyStart = "0:00";
            string duration = "0:00";

            try { earlyStart = Convert.ToInt32(EarlyStartMinText.Text).ToString("###0"); }
            catch { earlyStart = "0"; }
            try { earlyStart += ":" + Convert.ToInt32(EarlyStartSecText.Text).ToString("00"); }
            catch { earlyStart += ":00"; }

            try { duration = Convert.ToInt32(DurationMinText.Text).ToString("###0"); }
            catch { duration = "0"; }
            try { duration += ":" + Convert.ToInt32(DurationSecText.Text).ToString("00"); }
            catch { duration += ":00"; }

            string[] errors = ValidateService();
            if (errors.Length == 0)
            {
                int idx = Convert.ToInt32(ServiceIndexHid.Value);
                JArray services = (JArray)data["services"];
                JObject service = (idx == -1) ? new JObject() : (JObject)services[idx];
                service["videoUrl"] = VideoUrlText.Text;
                service["earlyStart"] = earlyStart;
                service["duration"] = duration;
                service["serviceTime"] = CountdownTimeText.Text;
                service["provider"] = ProviderList.SelectedValue;
                switch (ProviderList.SelectedValue)
                {
                    case "youtube_live":
                    case "youtube_watchparty":
                        service["providerKey"] = YouTubeKeyText.Text;
                        service["videoUrl"] = $"https://www.youtube.com/embed/{YouTubeKeyText.Text}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1";
                        break;
                    case "vimeo_live":
                    case "vimeo_watchparty":
                        service["providerKey"] = VimeoKeyText.Text;
                        service["videoUrl"] = $"https://player.vimeo.com/video/{VimeoKeyText.Text}?autoplay=1";
                        break;
                    case "facebook_live":
                        service["providerKey"] = FacebookKeyText.Text;
                        service["videoUrl"] = $"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D{FacebookKeyText.Text}&show_text=0&autoplay=1&allowFullScreen=1";
                        break;
                }

                if (idx == -1) services.Add(service);
                UpdateData();
                Populate();
            }
            else OutputMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true, ServiceOutputLit);
        }

        private string[] ValidateService()
        {
            List<string> errors = new List<string>();
            switch (ProviderList.SelectedValue)
            {
                case "youtube_live":
                case "youtube_watchparty":
                    if (YouTubeKeyText.Text=="") errors.Add("Please enter a YouTube video id.");
                    if (YouTubeKeyText.Text.Contains(":"))
                    {
                        Match m = Regex.Match(YouTubeKeyText.Text, @"[A-Za-z0-9\-_]{5,20}$");
                        if (m.Success) YouTubeKeyText.Text = m.Value;
                        else errors.Add("Invalid YouTube video id.");
                    }
                    break;
                case "vimeo_live":
                case "vimeo_watchparty":
                    if (VimeoKeyText.Text == "") errors.Add("Please enter a Vimeo id.");
                    if (VimeoKeyText.Text.Contains(":"))
                    {
                        Match m = Regex.Match(VimeoKeyText.Text, @"[0-9]{5,15}");
                        if (m.Success) VimeoKeyText.Text = m.Value;
                        else errors.Add("Invalid Vimeo id.");
                    }
                    break;
                case "facebook_live":
                    if (FacebookKeyText.Text == "") errors.Add("Please enter a Facebook video id.");
                    if (FacebookKeyText.Text.Contains(":"))
                    {
                        Match m = Regex.Match(FacebookKeyText.Text, @"[0-9]{10,20}");
                        if (m.Success) FacebookKeyText.Text = m.Value;
                        else errors.Add("Invalid Facebook video id.");
                    }
                    break;
            }
            return errors.ToArray();

        }

            private void OutputMessage(string msg, bool error, Literal outputLit)
        {
            if (error) outputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">" + msg + "</div>";
            else outputLit.Text = "<div class=\"alert alert-success\" role=\"alert\">" + msg + "</div>";
        }

        protected void CancelServiceButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void DeleteServiceButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(ServiceIndexHid.Value);
            if (idx > -1)
            {
                JArray services = (JArray)data["services"];
                services.RemoveAt(idx);
                UpdateData();
            }
            Populate();
        }

        protected void ServiceRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditServiceShow(e.Item.ItemIndex);
            }
        }

        private void EditServiceShow(int idx)
        {
            JArray services = (JArray)data["services"];
            JObject service = (idx == -1) ? new JObject() : (JObject)services[idx];
            ServiceEditHolder.Visible = true;
            ServiceListHolder.Visible = false;
            DeleteServiceHolder.Visible = idx > -1;

            ServiceIndexHid.Value = idx.ToString();

            ProviderList.SelectedValue = "custom_watchparty";
            if (idx > -1)
            {
                VideoUrlText.Text = Convert.ToString(service["videoUrl"]);

                if (service["earlyStart"] != null)
                {
                    string[] parts = service["earlyStart"].ToString().Split(':');
                    EarlyStartMinText.Text = parts[0];
                    EarlyStartSecText.Text = parts[1];
                }
                if (service["duration"] != null)
                {
                    string[] parts = service["duration"].ToString().Split(':');
                    DurationMinText.Text = parts[0];
                    DurationSecText.Text = parts[1];
                }
                CountdownTimeText.Text = Convert.ToString(service["serviceTime"]);
                VimeoKeyText.Text = Convert.ToString(service["providerKey"]);
                YouTubeKeyText.Text = Convert.ToString(service["providerKey"]);
                FacebookKeyText.Text = Convert.ToString(service["providerKey"]);
                try
                {
                    ProviderList.SelectedValue = Convert.ToString(service["provider"]);
                }
                catch { }
            }

            ShowProviderDetails();
            DeleteServiceButton.Visible = idx > -1;

        }

        protected void AddServiceLink_Click(object sender, EventArgs e)
        {
            EditServiceShow(-1);
        }

        

        protected void ProviderList_SelectedIndexChanged(object sender, EventArgs e)
        {
            ShowProviderDetails();
        }

        private void ShowProviderDetails()
        {
            string provider = ProviderList.SelectedValue;
            VideoEmbedHolder.Visible = false;
            YouTubeHolder.Visible = false;
            VimeoHolder.Visible = false;
            FacebookHolder.Visible = false;

            switch (provider)
            {
                case "custom_live":
                case "custom_watchparty":
                    VideoEmbedHolder.Visible = true;
                    break;
                case "youtube_live":
                case "youtube_watchparty":
                    YouTubeHolder.Visible = true;
                    break;
                case "vimeo_live":
                case "vimeo_watchparty":
                    VimeoHolder.Visible = true;
                    break;
                case "facebook_live":
                    FacebookHolder.Visible = true;
                    break;
            }
        }


    }
}