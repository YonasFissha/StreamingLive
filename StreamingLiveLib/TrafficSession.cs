using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    [Serializable]
    public class TrafficSession
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TrafficMinutes TrafficMinutes { get; set; } = new TrafficMinutes();

        public object GetPropertyValue(string propertyName)
        {
            return typeof(TrafficSession).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
        }

    }
}
