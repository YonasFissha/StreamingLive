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

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse UpdateConfig(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try { 
                JObject data = JObject.Parse(req.Body);
                data["ts"] = DateTime.UtcNow.Ticks;
                string room = data["room"].ToString();
                Logging.LogDebug("Updating " + room);
                SendMessages("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, Connection.GetConnectionIds(room), room, data);
                return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
            } catch (Exception ex) {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse RequestPrayer(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try { 
                JObject data = JObject.Parse(req.Body);
                string room = data["room"].ToString() + ".host";
                data["ts"] = DateTime.UtcNow.Ticks;
                Logging.LogDebug("Request Prayer - " + room);
                SendMessages("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, Connection.GetConnectionIds(room), room, data);
                Catchup.Store(room, data);
                return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse SetCallout(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try
            {
                JObject data = JObject.Parse(req.Body);
                string room = data["room"].ToString();
                data["ts"] = DateTime.UtcNow.Ticks;
                Logging.LogDebug("Request Set Callout - " + room);
                SendMessages("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, Connection.GetConnectionIds(room), room, data);
                Catchup.Store(room, data);
                return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse Send(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try {
                Logging.LogDebug("Send Message");
                JObject data = JObject.Parse(req.Body);
                string room = data["room"].ToString();
                Logging.LogDebug("Send Message - " + room);

                data["message"] = Utils.ReplaceBadWords(data["message"].ToString());
                data["ts"] = DateTime.UtcNow.Ticks;
                Logging.LogDebug("Sending Message - " + data["message"].ToString());
                SendMessages("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, Connection.GetConnectionIds(room), room, data);
                Catchup.Store(room, data);
                Logging.LogDebug("Catchup Stored");
                return new APIGatewayProxyResponse() { Body = error, StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse Delete(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try
            {
                JObject data = JObject.Parse(req.Body);
                string room = data["room"].ToString();
                Logging.LogDebug("Delete Message - " + room);
                SendMessages("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, Connection.GetConnectionIds(room), room, data);
                Catchup.Store(room, data);
                return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
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
