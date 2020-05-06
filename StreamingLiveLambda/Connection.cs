using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Amazon.ApiGatewayManagementApi;
using Amazon.ApiGatewayManagementApi.Model;
using System.IO;
using System.Collections;
using Amazon.Lambda.APIGatewayEvents;

namespace StreamingLiveLambda
{
    public class Connection
    {
        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public APIGatewayProxyResponse Join(APIGatewayProxyRequest req, ILambdaContext context)
        {
            
            JObject data = JObject.Parse(req.Body);
            string room = data["room"].ToString();
            StoreConnection(room, req.RequestContext.ConnectionId);
            JArray messages = Catchup.GetCatchup(room);
            if (messages.Count>0) Catchup.SendCatchup("wss://" + req.RequestContext.DomainName + "/" + req.RequestContext.Stage, req.RequestContext.ConnectionId, room, messages);
            return new APIGatewayProxyResponse() { Body = "success", StatusCode = 200 };
        }

        private static void StoreConnection(string room, string connectionId)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table chatTable = Table.LoadTable(client, "connections");
            Document doc = new Document();
            doc["room"] = room;
            doc["connectionId"] = connectionId;
            doc["joinTime"] = DateTime.Now;
            chatTable.PutItemAsync(doc);
        }

        internal static List<string> GetConnectionIds(string room)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            List<string> result = new List<string>();
            QueryRequest request = new QueryRequest
            {
                TableName = "connections",
                KeyConditionExpression = "room = :room",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":room", new AttributeValue { S = room } } },
                ProjectionExpression = "connectionId",
            };
            QueryResponse response = client.QueryAsync(request).Result;
            foreach (Dictionary<string, AttributeValue> item in response.Items) result.Add(item["connectionId"].S);
            return result;
        }

        internal static void Delete(string room, string connectionId)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table chatTable = Table.LoadTable(client, "connections");
            Document doc = new Document();
            doc["room"] = room;
            doc["connectionId"] = connectionId;
            chatTable.DeleteItemAsync(doc);
        }


        internal static void Cleanup()
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            DateTime threshold = DateTime.UtcNow.AddHours(-12);
            ScanRequest request = new ScanRequest
            {
                TableName = "connections",
                FilterExpression = "joinTime < :ts",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":ts", new AttributeValue { N = threshold.Ticks.ToString() } } },
                ProjectionExpression = "room, connectionId",
            };
            ScanResponse response = client.ScanAsync(request).Result;
            foreach (Dictionary<string, AttributeValue> item in response.Items) Delete(item["room"].ToString(), item["connectionId"].ToString());
        }


    }
}
