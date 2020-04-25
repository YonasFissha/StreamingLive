using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace StreamingLiveLib
{
    public class Utils
    {

        public static string GetJson(string url)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = client.GetAsync(url).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            return response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
        }


        public static string GetUrlContentsPost(string url, string rawData, string contentType, string userName = "", string password = "", string accept = "", string[] headers = null, string[] headerValues = null, X509Certificate2 certificate = null)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            byte[] data = new UTF8Encoding().GetBytes(rawData);
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "POST";
            if (accept != "") req.Accept = accept;
            if (userName != "") req.Credentials = new NetworkCredential(userName, password);
            if (headers != null) for (int i = 0; i < headers.Length; i++) req.Headers.Add(headers[i], headerValues[i]);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            req.ProtocolVersion = HttpVersion.Version11;

            if (contentType != "") req.ContentType = contentType;
            req.ContentLength = data.Length;
            Stream newStream = req.GetRequestStream();
            newStream.Write(data, 0, data.Length);
            newStream.Close();

            if (certificate != null) req.ClientCertificates.Add(certificate);



            string result = "";
            try
            {
                WebResponse resp = req.GetResponse();
                StreamReader sr = new StreamReader(resp.GetResponseStream());
                result = sr.ReadToEnd();
            }
            catch (WebException ex)
            {
                StreamReader sr = new StreamReader(ex.Response.GetResponseStream());
                throw new Exception(sr.ReadToEnd(), ex);
            }
            return result;
        }

    }
}
