using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using StreamingLiveLib;
using Amazon.S3;
using ImageMagick;

namespace StreamingLiveCore.Pages.CP
{
    

    public class SettingsModel : PageModel
    {
        public StreamingLiveLib.Service SelectedService;
        public StreamingLiveLib.Services Services;
        public string OutputMessage;
        public bool PendingChanges;
        IAmazonS3 S3Client { get; set; }

        [BindProperty]
        public string CountdownTime { get; set; }

        [BindProperty]
        public int ServiceId { get; set; }
        [BindProperty]
        public int DurationMin { get; set; }
        [BindProperty]
        public int DurationSec { get; set; }
        [BindProperty]
        public int ChatBefore { get; set; }
        [BindProperty]
        public int ChatAfter { get; set; }
        [BindProperty]
        public int EarlyStartMin { get; set; }
        [BindProperty]
        public int EarlyStartSec { get; set; }
        [BindProperty]
        public string Provider { get; set; }
        [BindProperty]
        public string VideoKey { get; set; }
        [BindProperty]
        public bool RecursWeekly { get; set; }
        [BindProperty]
        public int TimezoneOffset { get; set; }

        #region Buttons
        public StreamingLiveLib.Buttons Buttons;
        public StreamingLiveLib.Button SelectedButton;
        [BindProperty]
        public int ButtonId { get; set; }
        [BindProperty]
        public string ButtonText { get; set; }
        [BindProperty]
        public string ButtonUrl { get; set; }
        #endregion

        #region Tabs
        public StreamingLiveLib.Tabs Tabs;
        public StreamingLiveLib.Tab SelectedTab;
        [BindProperty]
        public int TabId { get; set; }
        [BindProperty]
        public string TabText { get; set; }
        [BindProperty]
        public string TabUrl { get; set; }
        [BindProperty]
        public string TabIcon { get; set; }
        [BindProperty]
        public string TabType { get; set; }
        [BindProperty]
        public string TabData { get; set; }
        public List<SelectListItem> Pages { get; set; }
        #endregion

        #region Appearance
        [BindProperty]
        public string LogoHtml { get; set; }
        [BindProperty]
        public string HomePageUrl { get; set; }
        [BindProperty]
        public string PrimaryColor { get; set; }
        [BindProperty]
        public string ContrastColor { get; set; }
        [BindProperty]
        public string HeaderColor { get; set; }
        [BindProperty]
        public BufferedSingleFileUpload Logo { get; set; }
        #endregion

        public SettingsModel(IAmazonS3 s3Client)
        {
            this.S3Client = s3Client;
        }


        public IActionResult OnGet()
        {
            if (AppUser.Current.Role.Name != "admin") return Redirect("/cp/");
            else
            {
                CheckPendingChanges();
                Populate();
                return Page();
            }
        }

        private void CheckPendingChanges()
        {
            PendingChanges = true;
            try
            {
                string existing = Utils.GetUrlContents($"{CachedData.ContentUrl}/data/{AppUser.Current.Site.KeyName}/data.json");
                string current = AppUser.Current.Site.LoadJson();
                PendingChanges = existing != current;
            }
            catch { }
        }

        private void LoadData()
        {
            Services = StreamingLiveLib.Services.LoadBySiteId(AppUser.Current.Site.Id).Sort("ServiceTime", false);
            Buttons = StreamingLiveLib.Buttons.LoadBySiteId(AppUser.Current.Site.Id);
            Tabs = StreamingLiveLib.Tabs.LoadBySiteId(AppUser.Current.Site.Id);
            Pages = new List<SelectListItem>();
            foreach (StreamingLiveLib.Page p in StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id))
            {
                Pages.Add(new SelectListItem(p.Name, p.Id.ToString()));
            }
            PopulateAppearance();
        }

        private void Populate()
        {
            LoadData();

            //AppearanceEditor1.Populate();
            //ButtonEditor1.Populate();
            //TabEditor1.Populate();
        }

        private void UpdateData()
        {
            PendingChanges = true;
            Populate();
        }

        public void OnGetPublish()
        {
            Utils.WriteToS3(S3Client, $"data/{AppUser.Current.Site.KeyName}/data.json", AppUser.Current.Site.LoadJson(), "application/json");
            Utils.WriteToS3(S3Client, $"data/{AppUser.Current.Site.KeyName}/data.css", AppUser.Current.Site.GetCss(), "text/css");
            PendingChanges = false;
            Populate();
        }

        public void OnPostSave()
        {
            int earlyStart = 0;
            int duration = 0;
            int chatBefore = 0;
            int chatAfter = 0;

            earlyStart = StreamingLiveLib.Utils.GetTotalSeconds(EarlyStartMin, EarlyStartSec);
            duration = StreamingLiveLib.Utils.GetTotalSeconds(DurationMin, DurationSec);
            chatBefore = StreamingLiveLib.Utils.GetTotalSeconds(ChatBefore, 0);
            chatAfter = StreamingLiveLib.Utils.GetTotalSeconds(ChatAfter, 0);

            string[] errors = ValidateService();
            if (errors.Length == 0)
            {
                StreamingLiveLib.Service service = (ServiceId == 0) ? new StreamingLiveLib.Service() { SiteId = AppUser.Current.Site.Id } : StreamingLiveLib.Service.Load(ServiceId, AppUser.Current.Site.Id);
                service.VideoUrl = VideoKey;
                service.EarlyStart = earlyStart;
                service.Duration = duration;
                service.TimezoneOffset = TimezoneOffset;
                service.ServiceTime = Convert.ToDateTime(CountdownTime).AddMinutes(service.TimezoneOffset);
                service.Provider = Provider;
                service.ProviderKey = VideoKey;
                service.ChatBefore = chatBefore;
                service.ChatAfter = chatAfter;
                service.Recurring = RecursWeekly;

                switch (Provider)
                {
                    case "youtube_live":
                    case "youtube_watchparty":
                        service.VideoUrl = $"https://www.youtube.com/embed/{VideoKey}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1";
                        break;
                    case "vimeo_live":
                    case "vimeo_watchparty":
                        service.VideoUrl = $"https://player.vimeo.com/video/{VideoKey}?autoplay=1";
                        break;
                    case "facebook_live":
                        service.VideoUrl = $"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D{VideoKey}&show_text=0&autoplay=1&allowFullScreen=1";
                        break;
                }
                service.Save();
            }
            OutputMessage = Utils.FormatMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true);
            UpdateData();
        }

        private string[] ValidateService()
        {
            List<string> errors = new List<string>();
            switch (Provider)
            {
                case "youtube_live":
                case "youtube_watchparty":
                    if (VideoKey== "") errors.Add("Please enter a YouTube video id.");
                    if (VideoKey.Contains(":"))
                    {
                        Match m = Regex.Match(VideoKey, @"[A-Za-z0-9\-_]{5,20}$");
                        if (m.Success) VideoKey = m.Value;
                        else errors.Add("Invalid YouTube video id.");
                    }
                    break;
                case "vimeo_live":
                case "vimeo_watchparty":
                    if (VideoKey == "") errors.Add("Please enter a Vimeo id.");
                    if (VideoKey.Contains(":"))
                    {
                        Match m = Regex.Match(VideoKey, @"[0-9]{5,15}");
                        if (m.Success) VideoKey = m.Value;
                        else errors.Add("Invalid Vimeo id.");
                    }
                    break;
                case "facebook_live":
                    if (VideoKey == "") errors.Add("Please enter a Facebook video id.");
                    if (VideoKey.Contains(":"))
                    {
                        Match m = Regex.Match(VideoKey, @"[0-9]{10,20}");
                        if (m.Success) VideoKey = m.Value;
                        else errors.Add("Invalid Facebook video id.");
                    }
                    break;
            }
            return errors.ToArray();

        }

        public void OnPostCancel()
        {
            Populate();
        }

        public void OnPostDelete()
        {
            StreamingLiveLib.Service.Delete(ServiceId, AppUser.Current.Site.Id);
            UpdateData();
            Populate();
        }

        public void OnGetAdd()
        {
            ServiceId = 0;
            EditServiceShow();
        }
        public void OnGetEdit()
        {
            ServiceId = Convert.ToInt32(Request.Query["id"]);
            EditServiceShow();
        }

        private void EditServiceShow()
        {
            SelectedService = (ServiceId == 0) ? new StreamingLiveLib.Service() { SiteId = AppUser.Current.Site.Id } : StreamingLiveLib.Service.Load(ServiceId, AppUser.Current.Site.Id);
            Provider = "custom_watchparty";
            if (ServiceId > 0)
            {
                VideoKey = SelectedService.VideoUrl;
                EarlyStartMin = StreamingLiveLib.Utils.GetMinutes(SelectedService.EarlyStart);
                EarlyStartSec = StreamingLiveLib.Utils.GetSeconds(SelectedService.EarlyStart);

                DurationMin = StreamingLiveLib.Utils.GetMinutes(SelectedService.Duration);
                DurationSec = StreamingLiveLib.Utils.GetSeconds(SelectedService.Duration);

                ChatBefore = StreamingLiveLib.Utils.GetMinutes(SelectedService.ChatBefore);
                ChatAfter = StreamingLiveLib.Utils.GetMinutes(SelectedService.ChatAfter);

                DateTime localServiceTime = SelectedService.ServiceTime;
                localServiceTime = localServiceTime.AddMinutes(-SelectedService.TimezoneOffset);
                CountdownTime = localServiceTime.ToString("yyyy-MM-dd") + "T" + localServiceTime.ToString("HH:mm");
                VideoKey = SelectedService.ProviderKey;
                Provider = SelectedService.Provider;
                RecursWeekly = SelectedService.Recurring;
                ServiceId = SelectedService.Id;
            }
            else
            {
                DateTime serviceTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 9, 0, 0);
                while (serviceTime.DayOfWeek != DayOfWeek.Sunday) serviceTime = serviceTime.AddDays(1);
                CountdownTime = serviceTime.ToString("yyyy-MM-dd") + "T" + serviceTime.ToString("HH:mm");
                EarlyStartMin = 15;
                EarlyStartSec = 0;
                DurationMin = 60;
                DurationSec = 0;
                ChatBefore = 15;
                ChatAfter = 15;
            }
            Populate();
        }


        #region Buttons
        //***I think this could be better segregated into a blazor component, but am not sure how to do the event handling.
        public void OnGetButtonAdd()
        {
            ButtonId = 0;
            EditButtonShow();
        }

        private void EditButtonShow()
        {
            LoadData();  
            SelectedButton = (ButtonId == 0) ? new StreamingLiveLib.Button() : StreamingLiveLib.Button.Load(ButtonId, AppUser.Current.Site.Id);
            ButtonUrl = SelectedButton.Url;
            ButtonText = SelectedButton.Text;
        }

        public void OnGetButtonUp()
        {
            int idx = Convert.ToInt32(Request.Query["idx"]);
            LoadData();
            Buttons[idx - 1].Sort = Buttons[idx - 1].Sort + 1;
            Buttons[idx].Sort = Buttons[idx].Sort - 1;
            Buttons[idx - 1].Save();
            Buttons[idx].Save();

            ButtonId = 0;
            UpdateData();
        }

        public void OnGetButtonDown()
        {
            int idx = Convert.ToInt32(Request.Query["idx"]);
            LoadData();
            Buttons[idx + 1].Sort = Buttons[idx + 1].Sort - 1;
            Buttons[idx].Sort = Buttons[idx].Sort + 1;
            Buttons[idx + 1].Save();
            Buttons[idx].Save();

            ButtonId = 0;
            UpdateData();
        }

        public void OnGetButtonEdit()
        {
            ButtonId = Convert.ToInt32(Request.Query["Id"]);
            EditButtonShow();
        }

        public void OnPostButtonCancel()
        {
            //***I think this is unnecessary.  How can I make the cancel button refire the OnGet() event?
            Populate();
        }

        public void OnPostButtonDelete()
        {
            StreamingLiveLib.Button.Delete(ButtonId, AppUser.Current.Site.Id);
            UpdateData();
            Populate();
        }

        public void OnPostButtonSave()
        {
            StreamingLiveLib.Button button = (ButtonId == 0) ? new StreamingLiveLib.Button() { SiteId = AppUser.Current.Site.Id, Sort = 999 } : StreamingLiveLib.Button.Load(ButtonId, AppUser.Current.Site.Id);
            button.Url = ButtonUrl;
            button.Text = ButtonText;
            button.Save();
            if (ButtonId == 0)
            {
                LoadData();
                Buttons.UpdateSort();
            }
            UpdateData();
            Populate();
        }

        #endregion


        #region Tabs
        //***I think this could be better segregated into a blazor component, but am not sure how to do the event handling.
        public void OnGetTabAdd()
        {
            TabId = 0;
            EditTabShow();
        }

        private void EditTabShow()
        {
            SelectTab();
            PopulateTab();
        }

        private void SelectTab()
        {
            LoadData();
            SelectedTab = (TabId == 0) ? new StreamingLiveLib.Tab() { TabType="url" } : StreamingLiveLib.Tab.Load(TabId, AppUser.Current.Site.Id);
        }

        public void OnGetTabUp()
        {
            int idx = Convert.ToInt32(Request.Query["idx"]);
            LoadData();
            Tabs[idx - 1].Sort = Tabs[idx - 1].Sort + 1;
            Tabs[idx].Sort = Tabs[idx].Sort - 1;
            Tabs[idx - 1].Save();
            Tabs[idx].Save();

            TabId = 0;
            UpdateData();
        }

        public void OnGetTabDown()
        {
            int idx = Convert.ToInt32(Request.Query["idx"]);
            LoadData();
            Tabs[idx + 1].Sort = Tabs[idx + 1].Sort - 1;
            Tabs[idx].Sort = Tabs[idx].Sort + 1;
            Tabs[idx + 1].Save();
            Tabs[idx].Save();
            TabId = 0;
            UpdateData();
        }

        public void OnGetTabEdit()
        {
            TabId = Convert.ToInt32(Request.Query["Id"]);
            EditTabShow();
        }

        public void OnPostTabCancel()
        {
            Populate();
        }

        public void OnPostTabSave()
        {
            StreamingLiveLib.Tab tab = (TabId == 0) ? new StreamingLiveLib.Tab() { SiteId = AppUser.Current.Site.Id, Sort = 999 } : StreamingLiveLib.Tab.Load(TabId, AppUser.Current.Site.Id);
            tab.Url = TabUrl;
            tab.Text = TabText;
            tab.Icon = TabIcon;
            tab.TabData = TabData;
            tab.TabType = TabType;

            if (tab.TabType == "page") tab.Url = $"/data/{AppUser.Current.Site.KeyName}/page{tab.TabData}.html";
            else if (tab.TabType == "chat") tab.Url = "/chat.html";
            else if (tab.TabType == "prayer") tab.Url = "/prayer.html";

            tab.Save();
            if (ButtonId == 0)
            {
                LoadData();
                Tabs.UpdateSort();
            }
            UpdateData();
            Populate();
        }

        public void OnPostTabDelete()
        {
            StreamingLiveLib.Tab.Delete(TabId, AppUser.Current.Site.Id);
            UpdateData();
            Populate();
        }

        public void OnPostTabTypeChanged()
        {
            LoadData();
            SelectTab();
            SelectedTab.TabType = TabType;
            PopulateTab();
        }

        private void PopulateTab()
        {
            TabUrl = SelectedTab.Url;
            TabText = SelectedTab.Text;
            TabIcon = SelectedTab.Icon;
            TabData = SelectedTab.TabData;
            TabType = SelectedTab.TabType;
        }

        #endregion

        #region Appearance
        private void PopulateAppearance()
        {
            StreamingLiveLib.Site site = AppUser.Current.Site;
            if (site.LogoUrl == "" || site.LogoUrl == null) LogoHtml = "none";
            else LogoHtml = $"<img src=\"{CachedData.ContentUrl}{site.LogoUrl}\" class=\"img-fluid\" />";
            HomePageUrl = site.HomePageUrl;
            PrimaryColor = site.PrimaryColor;
            ContrastColor = site.ContrastColor;
            HeaderColor = site.HeaderColor;
        }

        public void OnPostAppearanceSave()
        {
            
            StreamingLiveLib.Site site = AppUser.Current.Site;
            site.HomePageUrl = HomePageUrl;
            site.PrimaryColor = PrimaryColor;
            site.ContrastColor = ContrastColor;
            site.HeaderColor = HeaderColor;

            if (Logo!=null && Logo.FormFile!=null)
            {
                //string tempFile = Path.Combine(CachedData.Environment.WebRootPath, "/temp/" + AppUser.Current.UserData.Id.ToString() + ".png");

                byte[] photoBytes;
                using (var stream = new MemoryStream())
                {
                    Logo.FormFile.CopyToAsync(stream).Wait();
                    stream.Position = 0;
                    photoBytes = new byte[stream.Length];
                    stream.Read(photoBytes, 0, photoBytes.Length);
                }

                using (MemoryStream outStream = new MemoryStream())
                {
                    MagickImage image = new MagickImage(photoBytes);
                    int ratio = Convert.ToInt32(150.0 / Convert.ToDouble(image.Height));
                    image.Resize(image.Width * ratio, 150);
                    image.Write(outStream);
                    outStream.Position = 0;


                    S3Client.PutObjectAsync(new Amazon.S3.Model.PutObjectRequest()
                    {
                        BucketName = CachedData.S3ContentBucket,
                        InputStream = outStream,
                        ContentType = "image/png",
                        Key = $"data/{AppUser.Current.Site.KeyName}/logo.png",
                        CannedACL = S3CannedACL.PublicRead
                    }).Wait();
                }


            }
            site.LogoUrl = $"/data/{site.KeyName}/logo.png?dt=" + DateTime.UtcNow.Ticks.ToString();

            site.Save();

            AppUser au = AppUser.Current;
            au.Site = site;
            AppUser.Current = au; //*** This really shouldn't be necessary.  Updated session variables should automatically store in dynamodb.

            UpdateData();
            Populate();
        }

        #endregion


    }

    public class BufferedSingleFileUpload
    {
        public IFormFile FormFile { get; set; }
    }

}