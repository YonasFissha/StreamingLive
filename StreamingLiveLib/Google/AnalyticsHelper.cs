using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using Google.Apis.Services;
using Google.Apis.Auth.OAuth2;
using System.IO;


namespace StreamingLiveLib.Google
{
    public class AnalyticsHelper
    {
        private static AnalyticsReportingService service;

        private static void Init()
        {
            if (service == null)
            {
                string[] scopes = new string[] { AnalyticsReportingService.Scope.Analytics };
                GoogleCredential credential;
                using (var stream = new FileStream(System.Configuration.ConfigurationManager.AppSettings["AnalyticsCredentialFile"], FileMode.Open, FileAccess.Read))
                {
                    credential = GoogleCredential.FromStream(stream).CreateScoped(scopes);
                }
                BaseClientService.Initializer bi = new BaseClientService.Initializer() { ApplicationName = "StreamingLiveService", HttpClientInitializer = credential };
                service = new AnalyticsReportingService(bi);
            }
            
        }

        public static AnalyticsReport GetDailySessions(DateTime startDate, DateTime endDate, string site)
        {
            Init();
            
            DateRange dateRange = new DateRange() { StartDate = startDate.ToString("yyyy-MM-dd"), EndDate = endDate.ToString("yyyy-MM-dd") };
            Metric metric = new Metric() { Expression = "ga:sessions", Alias = "sessions" };
            Dimension dim = new Dimension() { Name = "ga:date" };

            ReportRequest rr = new ReportRequest() {
                ViewId = System.Configuration.ConfigurationManager.AppSettings["AnalyticsViewId"],
                DateRanges = new List<DateRange>() { dateRange },
                Metrics = new List<Metric>() { metric },
                Dimensions = new List<Dimension>() { dim },
                FiltersExpression = "ga:dimension1==" + site
            };

            GetReportsRequest grr = new GetReportsRequest() { ReportRequests = new List<ReportRequest>() { rr } };
            GetReportsResponse response = service.Reports.BatchGet(grr).Execute();

            AnalyticsReport result = new AnalyticsReport();
            if (response.Reports[0].Data.RowCount > 0)
            {
                foreach (ReportRow row in response.Reports[0].Data.Rows)
                {
                    result.Add(new AnalyticsRow() { Dimension = row.Dimensions[0], Metric = Convert.ToInt32(row.Metrics[0].Values[0]) });
                }
            }
            return result;
            

        }
    }
}
