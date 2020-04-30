using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    [Serializable]
    public class TrafficSessions : List<TrafficSession>
    {
        public TrafficSessions()
        {

        }

        public TrafficSessions(TrafficMinutes tMinutes)
        {
            TrafficSession currentSession = null;
            foreach (TrafficMinute tMin in tMinutes)
            {
                if (currentSession==null || currentSession.EndTime.AddMinutes(10)<tMin.Timestamp)  //new session
                {
                    if (currentSession != null  && currentSession.EndTime>currentSession.StartTime.AddMinutes(10)) this.Add(currentSession);
                    currentSession = new TrafficSession() { StartTime = tMin.Timestamp };
                }
                currentSession.EndTime = tMin.Timestamp;
                currentSession.TrafficMinutes.Add(tMin);
            }
            if (currentSession != null && currentSession.EndTime > currentSession.StartTime.AddMinutes(10)) this.Add(currentSession);
        }

        public TrafficSessions Sort(string column, bool desc)
        {
            var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
            TrafficSessions result = new TrafficSessions();
            foreach (var i in sortedList) { result.Add((TrafficSession)i); }
            return result;
        }

    }
}
