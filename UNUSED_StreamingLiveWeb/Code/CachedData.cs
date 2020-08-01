using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamingLiveWeb
{
    public class CachedData
    {
        public static string BaseUrl = System.Configuration.ConfigurationManager.AppSettings["BaseUrl"];
        public static string Environment = System.Configuration.ConfigurationManager.AppSettings["Environment"];
        public static string StripeSecret = System.Configuration.ConfigurationManager.AppSettings["StripeSecret"];
        public static string SupportEmail = System.Configuration.ConfigurationManager.AppSettings["SupportEmail"];
    }
}