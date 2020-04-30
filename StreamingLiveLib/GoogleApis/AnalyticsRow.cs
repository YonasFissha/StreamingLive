using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib.GoogleApis
{
    public class AnalyticsRow
    {
        public List<int> Metrics = new List<int>();
        public List<string> Dimensions = new List<string>();
    }
}
