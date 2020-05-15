using Amazon.ApiGatewayManagementApi;
using Amazon.ApiGatewayManagementApi.Model;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLambda
{
    public class Message
    {
        static string error = "success";

        public static void UpdateConfig(string apiUrl, string connectionId, string room, JObject data)
        {
            Logging.LogDebug("Updating " + room);
            data["ts"] = DateTime.UtcNow.Ticks;
            SendMessages(apiUrl, Connection.GetConnectionIds(room), room, data);
        }

        public static void RequestPrayer(string apiUrl, string connectionId, string room, JObject data)
        {
            room += ".host";
            Logging.LogDebug("Request Prayer - " + room);
            data["ts"] = DateTime.UtcNow.Ticks;
            SendMessages(apiUrl, Connection.GetConnectionIds(room), room, data);
            Catchup.Store(room, data);
        }

        public static void SetCallout(string apiUrl, string connectionId, string room, JObject data)
        {
            Logging.LogDebug("Request Set Callout - " + room);
            data["ts"] = DateTime.UtcNow.Ticks;
            SendMessages(apiUrl, Connection.GetConnectionIds(room), room, data);
            Catchup.Store(room, data);
        }

        public static void Send(string apiUrl, string connectionId, string room, JObject data)
        {
            Logging.LogDebug("Send Message - " + room);
            data["message"] = Utils.ReplaceBadWords(data["message"].ToString());
            data["ts"] = DateTime.UtcNow.Ticks;
            Logging.LogDebug("Sending Message - " + data["message"].ToString());
            SendMessages(apiUrl, Connection.GetConnectionIds(room), room, data);
            Catchup.Store(room, data);
            Logging.LogDebug("Catchup Stored");
        }

        public static void Delete(string apiUrl, string connectionId, string room, JObject data)
        {
            Logging.LogDebug("Delete Message - " + room);
            SendMessages(apiUrl, Connection.GetConnectionIds(room), room, data);
            Catchup.Store(room, data);
        }

        internal static void SendMessages(string serviceUrl, List<string> connectionIds, string room, JObject message)
        {
            Logging.LogDebug("Sending the message to " + connectionIds.Count.ToString() + " connection(s)");
            List<Task> tasks = new List<Task>();
            foreach (string connectionId in connectionIds) tasks.Add(SendMessage(serviceUrl, connectionId, room, message));
            Task.WaitAll(tasks.ToArray());
        }


        internal static Task SendMessage(string serviceUrl, string connectionId, string room, JObject message)
        {
            Task result = Task.Run(() => {
                MemoryStream stream = new MemoryStream(UTF8Encoding.UTF8.GetBytes(message.ToString(Newtonsoft.Json.Formatting.None)));
                AmazonApiGatewayManagementApiConfig config = new AmazonApiGatewayManagementApiConfig() { ServiceURL = serviceUrl  };
                AmazonApiGatewayManagementApiClient client = new AmazonApiGatewayManagementApiClient(config);
                PostToConnectionRequest postReq = new PostToConnectionRequest() { ConnectionId = connectionId, Data = stream };
                try
                {
                    Logging.LogDebug("Sending to: " + connectionId);
                    Task<PostToConnectionResponse> task = client.PostToConnectionAsync(postReq);
                    task.Wait();
                    Logging.LogDebug("Sent to: " + connectionId);
                }
                catch (Exception ex)
                {
                    Logging.LogDebug("Deleteing conneciton " + connectionId);
                    error = serviceUrl + " - " + connectionId + " - " + ex.ToString();
                    Connection.Delete(room, connectionId);
                    Logging.LogDebug("Deleted conneciton " + connectionId);
                }
            });

            return result;
        }

        

    }
}
