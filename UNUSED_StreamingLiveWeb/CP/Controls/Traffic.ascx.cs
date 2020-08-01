using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

namespace StreamingLiveWeb.CP.Controls
{
    public partial class Traffic : System.Web.UI.UserControl
    {
        public string ChartOutput
        {
            get { return Convert.ToString(ViewState["ChartOutput"]); }
            set { ViewState["ChartOutput"] = value; }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                StreamingLiveLib.GoogleApis.AnalyticsReport data = StreamingLiveLib.GoogleApis.AnalyticsHelper.GetDailySessions(DateTime.Today.AddDays(-15), DateTime.Today.AddDays(1), AppUser.Current.Site.KeyName + ".streaminglive.church");
                List<string> records = new List<string>();
                foreach (StreamingLiveLib.GoogleApis.AnalyticsRow row in data)
                {
                    DateTime date = Convert.ToDateTime(row.Dimensions[0].Substring(0, 4) + "-" + row.Dimensions[0].Substring(4, 2) + "-" + row.Dimensions[0].Substring(6, 2));
                    records.Add($"['{date.ToString("M/d")}',{row.Metrics[0]},'']");
                }
                ChartOutput = String.Join(",", records);
                this.Visible = data.Count > 0;
            }
        }
    }
}