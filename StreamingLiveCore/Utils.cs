using Amazon.S3;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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

        public static void WriteToS3(IAmazonS3 s3Client, string key, string content, string contentType)
        {
            s3Client.PutObjectAsync(new Amazon.S3.Model.PutObjectRequest()
            {
                BucketName = CachedData.S3ContentBucket,
                ContentBody = content,
                ContentType = contentType,
                Key = key,
                CannedACL = S3CannedACL.PublicRead
            }).Wait();
        }

        public static string GetUrlContents(string url)
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            WebResponse resp = req.GetResponse();
            StreamReader sr = new StreamReader(resp.GetResponseStream());
            string result = sr.ReadToEnd();
            return result;
        }


    }
}
