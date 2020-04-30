using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Reports
{
    public partial class Default : System.Web.UI.Page
    {
        public string ChartOutput;
        private StreamingLiveLib.TrafficSessions sessions
        {
            get { return (StreamingLiveLib.TrafficSessions)ViewState["sessions"]; }
            set { ViewState["sessions"] = value; }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                sessions = new StreamingLiveLib.TrafficSessions(StreamingLiveLib.TrafficMinutes.Load(DateTime.Today.AddDays(-5), DateTime.Today.AddDays(1), AppUser.Current.Site.KeyName + ".streaminglive.church"));
                sessions = sessions.Sort("StartTime", true);
                ServiceRepeater.DataSource = sessions;
                ServiceRepeater.DataBind();
                if (sessions.Count>0) ShowChart(sessions[0]);
            }
        }

        protected void ServiceRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            StreamingLiveLib.TrafficSession session = sessions[e.Item.ItemIndex];
            ShowChart(session);
        }

        protected void ServiceRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            StreamingLiveLib.TrafficSession session = (StreamingLiveLib.TrafficSession)e.Item.DataItem;
            LinkButton TimeLink = (LinkButton)e.Item.FindControl("TimeLink");
            TimeLink.Text = session.StartTime.ToString("hh:mm tt");
        }


        private void ShowChart(StreamingLiveLib.TrafficSession session)
        {
            ChartHolder.Visible = true;
            NoChartLit.Visible = false;
            List<string> records = new List<string>();
            foreach (StreamingLiveLib.TrafficMinute tm in session.TrafficMinutes)
            {
                records.Add($"['{tm.Timestamp.ToString("h:mm")}',{tm.ViewerCount}]");
            }
            ChartOutput = String.Join(",", records);
        }

    }
}