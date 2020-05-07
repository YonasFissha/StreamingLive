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
using StreamingLiveLib;

namespace StreamingLiveWeb.CP.Live
{
    public partial class Default : System.Web.UI.Page
    {
        public string PreviewUrl = "http://localhost:201/?preview=1";
        StreamingLiveLib.Services services;

        public bool PendingChanges
        {
            get { return Convert.ToBoolean(ViewState["PendingChanges"]); }
            set { ViewState["PendingChanges"] = value; }
        }
       

        protected void Page_Load(object sender, EventArgs e)
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            if (CachedData.Environment=="prod") PreviewUrl = "https://" + AppUser.Current.Site.KeyName + ".streaminglive.church/?preview=1";
            string liveUrl = "https://" + AppUser.Current.Site.KeyName + ".streaminglive.church/";
            LiveLinkLit.Text = $"<p style=\"margin-top:10px;margin-bottom:0px;\">View your live site: <a href=\"{liveUrl}\" target=\"_blank\">{liveUrl}</a></p>";

            if (!IsPostBack) CheckPendingChanges();

            AppearanceEditor1.DataUpdated += AppearanceEditor1_DataUpdated;
            ButtonEditor1.DataUpdated += ButtonEditor1_DataUpdated;
            TabEditor1.DataUpdated += TabEditor1_DataUpdated;

            if (!IsPostBack) Populate();
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            bool isPulsing = PublishButton.CssClass.Contains("pulsing");
            if (!PendingChanges && isPulsing) PublishButton.CssClass = PublishButton.CssClass.Replace(" pulsing", "");
            else if (PendingChanges && !isPulsing) PublishButton.CssClass = PublishButton.CssClass + " pulsing";
        }


        private void CheckPendingChanges()
        {
            PendingChanges = true;
            try
            {
                string existing = System.IO.File.ReadAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.json"));
                string current = AppUser.Current.Site.LoadJson();
                PendingChanges = existing != current;
            }
            catch { }
        }

        private void LoadData()
        {
            services = StreamingLiveLib.Services.LoadBySiteId(AppUser.Current.Site.Id);
        }

        private void AppearanceEditor1_DataUpdated(object sender, EventArgs e)
        {
            UpdateData();
        }

        private void ButtonEditor1_DataUpdated(object sender, EventArgs e)
        {
            UpdateData();
        }

       

        private void TabEditor1_DataUpdated(object sender, EventArgs e)
        {
            UpdateData();
        }

        private void Populate()
        {
            LoadData();
            UpdateConfigHolder.Visible = false;

            ServiceRepeater.DataSource = services;
            ServiceRepeater.DataBind();
            NoServicesLit.Visible = services.Count == 0;

            ServiceEditHolder.Visible = false;
            ServiceListHolder.Visible = true;

            AppearanceEditor1.Populate();
            ButtonEditor1.Populate();
            TabEditor1.Populate();
        }


        private void UpdateData()
        {
            PendingChanges = true;
            Populate();
        }

        

        protected void PublishButton_Click(object sender, EventArgs e)
        {
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.json"), AppUser.Current.Site.LoadJson());
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.css"), AppUser.Current.Site.GetCss());

            UpdateConfigHolder.Visible = true;
            PendingChanges = false;
        }

        protected void SaveServiceButton_Click(object sender, EventArgs e)
        {

            int earlyStart = 0;
            int duration = 0;
            int chatBefore = 0;
            int chatAfter = 0;

            earlyStart = StreamingLiveLib.Utils.GetTotalSeconds(EarlyStartMinText.Text, EarlyStartSecText.Text);
            duration = StreamingLiveLib.Utils.GetTotalSeconds(DurationMinText.Text, DurationSecText.Text);
            chatBefore = StreamingLiveLib.Utils.GetTotalSeconds(ChatBeforeText.Text, "0");
            chatAfter = StreamingLiveLib.Utils.GetTotalSeconds(ChatAfterText.Text, "0");

            string[] errors = ValidateService();
            if (errors.Length == 0)
            {
                int id = Convert.ToInt32(ServiceIdHid.Value);
                StreamingLiveLib.Service service = (id == 0) ? new StreamingLiveLib.Service() { SiteId = AppUser.Current.Site.Id } : StreamingLiveLib.Service.Load(id, AppUser.Current.Site.Id);
                service.VideoUrl = VideoUrlText.Text;
                service.EarlyStart = earlyStart;
                service.Duration = duration;
                service.TimezoneOffset = Convert.ToInt32(TZOffsetHid.Value);
                service.ServiceTime = Convert.ToDateTime(CountdownTimeText.Text).AddMinutes(service.TimezoneOffset);
                service.Provider = ProviderList.SelectedValue;
                service.ProviderKey = "";
                service.ChatBefore = chatBefore;
                service.ChatAfter = chatAfter;
                service.Recurring = Convert.ToBoolean(RecurringList.SelectedValue);

                switch (ProviderList.SelectedValue)
                {
                    case "youtube_live":
                    case "youtube_watchparty":
                        service.ProviderKey = YouTubeKeyText.Text;
                        service.VideoUrl = $"https://www.youtube.com/embed/{YouTubeKeyText.Text}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1";
                        break;
                    case "vimeo_live":
                    case "vimeo_watchparty":
                        service.ProviderKey = VimeoKeyText.Text;
                        service.VideoUrl = $"https://player.vimeo.com/video/{VimeoKeyText.Text}?autoplay=1";
                        break;
                    case "facebook_live":
                        service.ProviderKey = FacebookKeyText.Text;
                        service.VideoUrl = $"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D{FacebookKeyText.Text}&show_text=0&autoplay=1&allowFullScreen=1";
                        break;
                }
                service.Save();
                UpdateData();
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
            int id = Convert.ToInt32(ServiceIdHid.Value);
            if (id > 0)
            {
                StreamingLiveLib.Service.Delete(id, AppUser.Current.Site.Id);
                UpdateData();
            }
            Populate();
        }

        protected void ServiceRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditServiceShow(Convert.ToInt32(e.CommandArgument));
            }
        }

        private void EditServiceShow(int id)
        {
            StreamingLiveLib.Service service = (id == 0) ? new StreamingLiveLib.Service() { SiteId = AppUser.Current.Site.Id } : StreamingLiveLib.Service.Load(id, AppUser.Current.Site.Id);
            ServiceEditHolder.Visible = true;
            ServiceListHolder.Visible = false;
            DeleteServiceHolder.Visible = id != 0;

            ServiceIdHid.Value = id.ToString();

            ProviderList.SelectedValue = "custom_watchparty";
            if (id > 0)
            {
                VideoUrlText.Text = service.VideoUrl;

                EarlyStartMinText.Text = StreamingLiveLib.Utils.GetMinutes(service.EarlyStart).ToString();
                EarlyStartSecText.Text = StreamingLiveLib.Utils.GetSeconds(service.EarlyStart).ToString();

                DurationMinText.Text = StreamingLiveLib.Utils.GetMinutes(service.Duration).ToString();
                DurationSecText.Text = StreamingLiveLib.Utils.GetSeconds(service.Duration).ToString();

                ChatBeforeText.Text = StreamingLiveLib.Utils.GetMinutes(service.ChatBefore).ToString();
                ChatAfterText.Text = StreamingLiveLib.Utils.GetMinutes(service.ChatAfter).ToString();

                DateTime localServiceTime = service.ServiceTime;
                localServiceTime = localServiceTime.AddMinutes(-Convert.ToInt32(TZOffsetHid.Value));
                CountdownTimeText.Text = localServiceTime.ToString("yyyy-MM-dd") + "T" + localServiceTime.ToString("HH:mm");
                VimeoKeyText.Text = service.ProviderKey;
                YouTubeKeyText.Text = service.ProviderKey;
                FacebookKeyText.Text = service.ProviderKey;
                try
                {
                    ProviderList.SelectedValue = service.Provider;
                }
                catch { }

                RecurringList.SelectedValue = service.Recurring.ToString();

            } else
            {
                DateTime serviceTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 9, 0, 0);
                while (serviceTime.DayOfWeek != DayOfWeek.Sunday) serviceTime = serviceTime.AddDays(1);
                CountdownTimeText.Text = serviceTime.ToString("yyyy-MM-dd") + "T" + serviceTime.ToString("HH:mm");
                EarlyStartMinText.Text = "15";
                EarlyStartSecText.Text = "0";
                DurationMinText.Text = "60";
                DurationSecText.Text = "0";
                ChatBeforeText.Text = "15";
                ChatAfterText.Text = "15";
            }

            ShowProviderDetails();
            DeleteServiceButton.Visible = id > 0;

        }

        protected void AddServiceLink_Click(object sender, EventArgs e)
        {
            EditServiceShow(0);
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

        protected void ServiceRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            LinkButton EditButton = (LinkButton)e.Item.FindControl("EditButton");
            Literal ServiceTimeLit = (Literal)e.Item.FindControl("ServiceTimeLit");
            StreamingLiveLib.Service service = (StreamingLiveLib.Service)e.Item.DataItem;

            DateTime localServiceTime = service.ServiceTime.AddMinutes(-service.TimezoneOffset);
            ServiceTimeLit.Text = localServiceTime.ToString();

            
            EditButton.CommandArgument = service.Id.ToString();

        }
    }
}