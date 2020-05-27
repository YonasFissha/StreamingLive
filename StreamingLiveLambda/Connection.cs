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
        
        public static void Join(string apiUrl, string connectionId, string room, JObject data)
        {
            Logging.LogDebug("Join " + room);
            StoreConnection(room, connectionId);
            JArray messages = Catchup.GetCatchup(room);
            if (messages.Count > 0) Catchup.SendCatchup(apiUrl, connectionId, room, messages);
            Logging.LogDebug("Catchup sent");
        }

        private static void StoreConnection(string room, string connectionId)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table chatTable = Table.LoadTable(client, "connections");
            Document doc = new Document();
            doc["room"] = room;
            doc["connectionId"] = connectionId;
            doc["joinTime"] = DateTime.Now.Ticks;
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
            Logging.LogDebug("Cleaning connections");
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
            foreach (Dictionary<string, AttributeValue> item in response.Items) Delete(item["room"].S, item["connectionId"].S);
        }


    }
}
