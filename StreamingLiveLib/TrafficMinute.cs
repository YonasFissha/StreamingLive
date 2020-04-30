using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    [Serializable]
    public class TrafficMinute
    {
        public DateTime Timestamp;
        public int ViewerCount;
    }
}
