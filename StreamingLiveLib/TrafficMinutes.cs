using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    [Serializable]
    public class TrafficMinutes:List<TrafficMinute>
    {
        public static TrafficMinutes Load(DateTime startDate, DateTime endDate, string site)
        {
            TrafficMinutes result = new TrafficMinutes();
            GoogleApis.AnalyticsReport report = GoogleApis.AnalyticsHelper.LoadStreamMinutes(startDate, endDate, site);
            foreach (GoogleApis.AnalyticsRow row in report)
            {
                string d = row.Dimensions[0];
                DateTime ts = new DateTime(Convert.ToInt32(d.Substring(0, 4)), Convert.ToInt32(d.Substring(4, 2)), Convert.ToInt32(d.Substring(6, 2)), Convert.ToInt32(d.Substring(8,2)), Convert.ToInt32(d.Substring(10,2)), 0);
                TrafficMinute tm = new TrafficMinute() { Timestamp = ts, ViewerCount=row.Metrics[0] };
                result.Add(tm);
            }
            return result;
        }
    }
}
