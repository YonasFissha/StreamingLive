using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using StreamingLiveLib;

namespace StreamingLiveCore.Pages.CP
{
    public class SettingsModel : PageModel
    {
        public StreamingLiveLib.Service SelectedService;
        public StreamingLiveLib.Services Services;
        public string OutputMessage;
        public bool PendingChanges;

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

        public void OnGet()
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            CheckPendingChanges();
            Populate();
            //AppearanceEditor1.DataUpdated += AppearanceEditor1_DataUpdated;
            //ButtonEditor1.DataUpdated += ButtonEditor1_DataUpdated;
            //TabEditor1.DataUpdated += TabEditor1_DataUpdated;
        }

        private void CheckPendingChanges()
        {
            PendingChanges = true;
            try
            {
                string existing = System.IO.File.ReadAllText(Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/data.json"));
                string current = AppUser.Current.Site.LoadJson();
                PendingChanges = existing != current;
            }
            catch { }
        }

        private void LoadData()
        {
            Services = StreamingLiveLib.Services.LoadBySiteId(AppUser.Current.Site.Id).Sort("ServiceTime", false);
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
            System.IO.File.WriteAllText(Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/data.json"), AppUser.Current.Site.LoadJson());
            System.IO.File.WriteAllText(Path.Combine(CachedData.DataFolder, AppUser.Current.Site.KeyName + "/data.css"), AppUser.Current.Site.GetCss());
            PendingChanges = false;
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
                UpdateData();
            }
            OutputMessage = Utils.FormatMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true);
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
                localServiceTime = localServiceTime.AddMinutes(-TimezoneOffset);
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
        }



    }
}