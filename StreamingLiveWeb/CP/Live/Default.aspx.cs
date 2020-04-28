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

            if (!IsPostBack) Populate();
        }

        private void Populate()
        {

            UpdateConfigHolder.Visible = false;

            JObject logo = (JObject)data["logo"];
            LogoLit.Text = "<img src=\"" + logo["image"].ToString() + "\" class=\"img-fluid\" />";
            HomePageText.Text = logo["url"].ToString();

            JObject colors = (JObject)data["colors"];
            PrimaryColorText.Text = colors["primary"].ToString();
            ContrastColorText.Text = colors["contrast"].ToString();
            HeaderColorText.Text = colors["header"].ToString();


            JArray buttons = (JArray)data["buttons"];
            ButtonRepeater.DataSource = buttons;
            ButtonRepeater.DataBind();

            JArray tabs = (JArray)data["tabs"];
            TabRepeater.DataSource = tabs;
            TabRepeater.DataBind();

            JArray services = (JArray)data["services"];
            ServiceRepeater.DataSource = services;
            ServiceRepeater.DataBind();
            NoServicesLit.Visible = services.Count == 0;

            ButtonEditHolder.Visible = false;
            ButtonListHolder.Visible = true;

            TabEditHolder.Visible = false;
            TabListHolder.Visible = true;

            ServiceEditHolder.Visible = false;
            ServiceListHolder.Visible = true;
        }


        private void LoadData()
        {
            JsonData = StreamingLiveLib.Utils.GetJson(CachedData.BaseUrl + "/data/" + AppUser.Current.Site.KeyName + "/preview.json");
        }

        private void CleanData()
        {
            JArray tabs = (JArray)data["tabs"];
            foreach (JObject tab in tabs) if (tab["icon"] == null) tab["icon"] = "";
        }

        private void UpdateData()
        {
            JsonData = data.ToString(Formatting.None);
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.json"), JsonData);
        }

        protected void SaveAppearanceButton_Click(object sender, EventArgs e)
        {
            JObject logo = (JObject)data["logo"];
            logo["url"] = HomePageText.Text;

            JObject colors = (JObject)data["colors"];
            colors["primary"] = PrimaryColorText.Text;
            colors["contrast"] = ContrastColorText.Text;
            colors["header"] = HeaderColorText.Text;

            if (LogoUpload.HasFile)
            {
                string tempFile = Server.MapPath("/temp/" + AppUser.Current.UserData.Id.ToString() + ".png");
                LogoUpload.SaveAs(tempFile);
                System.Drawing.Image img = System.Drawing.Bitmap.FromFile(tempFile);

                var ratio =  150.0 / Convert.ToDouble(img.Height);
                System.Drawing.Image outImg = new System.Drawing.Bitmap(Convert.ToInt32(img.Width * ratio), 150);
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(outImg);
                g.CompositingMode = CompositingMode.SourceCopy;
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                Rectangle destRect = new Rectangle(0, 0, outImg.Width, outImg.Height);

                ImageAttributes wrapMode = new ImageAttributes();
                wrapMode.SetWrapMode(WrapMode.TileFlipXY); ;

                g.DrawImage(img, destRect, 0, 0, img.Width, img.Height, GraphicsUnit.Pixel, wrapMode);
                outImg.Save(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/logo.png"));
                logo["image"] = "/data/" + AppUser.Current.Site.KeyName + "/logo.png?dt=" + DateTime.Now.ToString("Mdyyyyhhmmss");

                g.Dispose();
                img.Dispose();

                System.IO.File.Delete(tempFile);

            }

            string previewCss = ":root { --primaryColor: " + PrimaryColorText.Text + "; --contrastColor: " + ContrastColorText.Text + "; --headerColor: " + HeaderColorText.Text + "}";
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.css"), previewCss);


            UpdateData();
            Populate();
        }

        protected void PublishButton_Click(object sender, EventArgs e)
        {
            JsonData = data.ToString(Formatting.None);
            System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.json"), JsonData);
            System.IO.File.Copy(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.css"), Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/data.css"), true);

            UpdateConfigHolder.Visible = true;

        }

        #region Buttons

        protected void ButtonRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditButtonShow(e.Item.ItemIndex);
            }
        }

        private void EditButtonShow(int idx)
        {
            JArray buttons = (JArray)data["buttons"];
            JObject button = (idx == -1) ? new JObject() : (JObject)buttons[idx];
            ButtonEditHolder.Visible = true;
            ButtonListHolder.Visible = false;

            ButtonIndexHid.Value = idx.ToString();
            ButtonUrlText.Text = Convert.ToString(button["url"]);
            ButtonTextText.Text = Convert.ToString(button["text"]);

            DeleteButtonHolder.Visible = idx > -1;

        }

        protected void SaveButtonButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(ButtonIndexHid.Value);
            JArray buttons = (JArray)data["buttons"];
            JObject button = (idx == -1) ? new JObject() : (JObject)buttons[idx];
            button["url"] = ButtonUrlText.Text;
            button["text"] = ButtonTextText.Text;
            if (idx == -1) buttons.Add(button);
            UpdateData();
            Populate();
        }

        protected void DeleteButtonButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(ButtonIndexHid.Value);
            if (idx > -1)
            {
                JArray buttons = (JArray)data["buttons"];
                buttons.RemoveAt(idx);
                UpdateData();
            }
            Populate();
        }

        protected void CancelButtonButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void AddButtonLink_Click(object sender, EventArgs e)
        {
            EditButtonShow(-1);
        }

        #endregion

        #region Tabs

        protected void TabRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditTabShow(e.Item.ItemIndex);
            }
        }

        private void EditTabShow(int idx)
        {
            JArray tabs = (JArray)data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            TabEditHolder.Visible = true;
            TabListHolder.Visible = false;

            TabIndexHid.Value = idx.ToString();

            try
            {
                TabType.SelectedValue = Convert.ToString(tab["type"]);
            } catch { }
            TabTextText.Text = Convert.ToString(tab["text"]);
            DeleteTabHolder.Visible = idx > -1;
            
            PopulateTabDetails(tab);
        }

        private void PopulateTabDetails(JObject tab)
        {
            TabUrlHolder.Visible = false;
            PageHolder.Visible = false;

            if (tab["icon"]!=null) TabIcon.Attributes["data-icon"] = tab["icon"].ToString();

            if (TabType.SelectedValue == "url")
            {
                TabUrlHolder.Visible = true;
                TabUrlText.Text = Convert.ToString(tab["url"]);
            }
            else if (TabType.SelectedValue=="page")
            {
                PageHolder.Visible = true;
                PageList.DataSource = StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id.Value);
                PageList.DataBind();
                try
                {
                    PageList.SelectedValue = tab["data"].ToString();
                } catch { }
            }
        }


        protected void SaveTabButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            JArray tabs = (JArray)data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            tab["url"] = TabUrlText.Text;
            tab["type"] = TabType.SelectedValue;
            tab["data"] = (TabType.SelectedValue == "page") ? PageList.SelectedValue : "";
            tab["text"] = TabTextText.Text;
            tab["icon"] = Request["TabIcon"];

            if (TabType.SelectedValue == "page")
            {
                tab["url"] = $"/data/{AppUser.Current.Site.KeyName}/page{PageList.SelectedValue}.html";
            }

            if (TabType.SelectedValue == "chat") tab["url"] = "/chat.html";
            if (TabType.SelectedValue == "prayer") tab["url"] = "/prayer.html";


            if (idx == -1) tabs.Add(tab);
            UpdateData();
            Populate();
        }

        protected void DeleteTabButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            if (idx > -1)
            {
                JArray tabs = (JArray)data["tabs"];
                tabs.RemoveAt(idx);
                UpdateData();
            }
            Populate();
        }

        protected void CancelTabButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void AddTabLink_Click(object sender, EventArgs e)
        {
            EditTabShow(-1);
        }

        #endregion

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

                //tab["text"] = TabTextText.Text;
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

            //TabTextText.Text = Convert.ToString(tab["text"]);

            DeleteTabButton.Visible = idx > -1;

        }

        protected void AddServiceLink_Click(object sender, EventArgs e)
        {
            EditServiceShow(-1);
        }

        protected void TabType_SelectedIndexChanged(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            JArray tabs = (JArray)data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            PopulateTabDetails(tab);
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