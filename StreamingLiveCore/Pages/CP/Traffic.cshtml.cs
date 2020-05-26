using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.CP
{
    public class TrafficModel : PageModel
    {
        public string ChartOutput;
        public StreamingLiveLib.TrafficSessions Sessions;

        public void OnGet()
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            LoadSessions();
            if (Sessions.Count > 0) ShowChart(Sessions[0]);
        }

        public void OnGetShow()
        {
            int idx = Convert.ToInt32(Request.Query["id"]);
            LoadSessions();
            StreamingLiveLib.TrafficSession session = Sessions[idx];
            ShowChart(session);
        }

        private void LoadSessions()
        {
            Sessions = new StreamingLiveLib.TrafficSessions(StreamingLiveLib.TrafficMinutes.Load(DateTime.Today.AddDays(-5), DateTime.Today.AddDays(1), AppUser.Current.Site.KeyName + ".streaminglive.church"));
            Sessions = Sessions.Sort("StartTime", true);
        }

        

        private void ShowChart(StreamingLiveLib.TrafficSession session)
        {
            List<string> records = new List<string>();
            foreach (StreamingLiveLib.TrafficMinute tm in session.TrafficMinutes) records.Add($"['{tm.Timestamp.ToString("h:mm")}',{tm.ViewerCount}]");
            ChartOutput = String.Join(",", records);
        }

    }
}