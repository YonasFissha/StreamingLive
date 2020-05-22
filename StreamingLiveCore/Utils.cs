using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamingLiveCore
{
    public class Utils
    {
        public static string FormatMessage(string msg, bool error)
        {
            if (error) return "<div class=\"alert alert-warning\" role=\"alert\">" + msg + "</div>";
            else return "<div class=\"alert alert-success\" role=\"alert\">" + msg + "</div>";
        }
    }
}
