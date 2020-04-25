using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace StreamingLiveWeb
{
    public class StripeHelper
    {
        private static string baseUrl = "https://api.stripe.com/v1/";

        public static string CreateIntent( double amount, string email)
        {
            string json = Post(baseUrl + "payment_intents", new[] { "amount", "currency", "receipt_email" },
                new[] {  Convert.ToInt32(amount * 100).ToString(), "USD", email }
            );
            dynamic data = JsonConvert.DeserializeObject(json);
            return data.client_secret.ToString();
        }

        private static string Post(string url, string[] parameters, string[] values)
        {
            List<string> p = new List<string>();
            for (int i = 0; i < parameters.Length; i++) p.Add(parameters[i] + "=" + values[i]);

            string qs = string.Join("&", p);
            return StreamingLiveLib.Utils.GetUrlContentsPost(url, qs, "application/x-www-form-urlencoded", CachedData.StripeSecret);
        }


    }
}