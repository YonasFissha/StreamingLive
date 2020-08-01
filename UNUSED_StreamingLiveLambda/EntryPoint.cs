﻿using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace StreamingLiveLambda
{
    public class EntryPoint
    {
        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse HandleChat(APIGatewayProxyRequest req, ILambdaContext context)
        {
            Logging.Init();
            try
            {
                string apiUrl = "wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage;

                if (req.RequestContext.EventType == "DISCONNECT") RouteChat(apiUrl, req.RequestContext.ConnectionId, "disconnect", null, null);
                else
                {
                    JObject data = JObject.Parse(req.Body);
                    string action = Convert.ToString(data["action"]);
                    string room = Convert.ToString(data["room"]);
                    RouteChat(apiUrl, req.RequestContext.ConnectionId, action, room, data);
                }
                return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Logging.LogException(ex);
                return new APIGatewayProxyResponse() { Body = ex.ToString(), StatusCode = 500 };
            }
        }

        private void RouteChat(string apiUrl, string connectionId, string action, string room, JObject data)
        {
            Logging.LogDebug(action);
            if (action == "joinRoom") Connection.Join(apiUrl, connectionId, room, data);
            else if (action == "setName") Connection.SetName(apiUrl, connectionId, data);
            else if (action == "disconnect") Connection.Delete(apiUrl, connectionId);

            else if (action == "updateConfig") Message.UpdateConfig(apiUrl, connectionId, room, data);
            else if (action == "requestPrayer") Message.RequestPrayer(apiUrl, connectionId, room, data);
            else if (action == "setCallout") Message.SetCallout(apiUrl, connectionId, room, data);
            else if (action == "sendMessage") Message.Send(apiUrl, connectionId, room, data);
            else if (action == "deleteMessage") Message.Delete(apiUrl, connectionId, room, data);
            
            else if (action == "cleanup") Cleanup();
        }

        private void Cleanup()
        {
            Connection.Cleanup();
            Catchup.Cleanup();
            Logging.LogDebug("Cleanup complete");
        }

    }
}
