﻿using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamingLiveCore
{
    public class CachedData
    {
        public static IWebHostEnvironment Environment;
        public static string SupportEmail;
        public static string S3ContentBucket;
        public static string ContentUrl;
        public static string BaseUrl;
    }
}
