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
            string name = (data["displayName"] ==null) ? "Anonymous" : data["displayName"].ToString();
            Logging.LogDebug("Join " + room);
            StoreConnection(room, connectionId, name);
            JArray messages = Catchup.GetCatchup(room);
            if (messages.Count > 0) Catchup.SendCatchup(apiUrl, connectionId, room, messages);
            Logging.LogDebug("Catchup sent");
            SendAttendance(apiUrl, room);
        }


        public static Task SetName(string apiUrl, string connectionId, string room, string name)
        {
            Task result = Task.Run(() =>
            {
                Logging.LogDebug("Setting name " + room);
                AmazonDynamoDBClient client = new AmazonDynamoDBClient();

                Dictionary<string, AttributeValue> key = new Dictionary<string, AttributeValue>
                {
                    { "connectionId", new AttributeValue { S = connectionId } },
                    { "room", new AttributeValue { S = room } }
                };

                Dictionary<string, AttributeValueUpdate> row = new Dictionary<string, AttributeValueUpdate>();
                row["displayName"] = new AttributeValueUpdate()
                {
                    Action = AttributeAction.PUT,
                    Value = new AttributeValue { S = name }
                };

                UpdateItemRequest request = new UpdateItemRequest
                {
                    TableName = "connections",
                    Key = key,
                    AttributeUpdates = row
                };

                client.UpdateItemAsync(request).Wait();
                SendAttendance(apiUrl, room);
            });
            return result;
        }

        public static void SetName(string apiUrl, string connectionId, JObject data)
        {
            string name = data["displayName"].ToString();

            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            ScanRequest request = new ScanRequest
            {
                TableName = "connections",
                FilterExpression = "connectionId = :connectionId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":connectionId", new AttributeValue { S = connectionId } } },
                ProjectionExpression = "room, connectionId"
            };
            ScanResponse response = client.ScanAsync(request).Result;
            
            List<Task> tasks = new List<Task>();
            foreach (Dictionary<string, AttributeValue> item in response.Items) tasks.Add(SetName(apiUrl, item["connectionId"].S, item["room"].S, name));
            
            Task.WaitAll(tasks.ToArray());
        }

        private static void StoreConnection(string room, string connectionId, string name)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table chatTable = Table.LoadTable(client, "connections");
            Document doc = new Document();
            doc["room"] = room;
            doc["connectionId"] = connectionId;
            doc["displayName"] = name;
            doc["joinTime"] = DateTime.Now.Ticks;
            doc["prettyJoinTime"] = DateTime.Now.ToString();
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


        

        private static List<string> GetAttendance(string room)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            List<string> result = new List<string>();
            QueryRequest request = new QueryRequest
            {
                TableName = "connections",
                KeyConditionExpression = "room = :room",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":room", new AttributeValue { S = room } } },
                ProjectionExpression = "displayName"
            };
            QueryResponse response = client.QueryAsync(request).Result;
            foreach (Dictionary<string, AttributeValue> item in response.Items) result.Add(item["displayName"].S);
            return result;
        }

        internal static JObject GetAttendanceMessage(string room)
        {
            List<string> names = GetAttendance(room);
            SortedDictionary<string, int> consolidated = new SortedDictionary<string, int>();
            names.Sort();
            foreach (string name in names)
            {
                if (consolidated.ContainsKey(name)) consolidated[name] = Convert.ToInt32(consolidated[name]) + 1;
                else consolidated[name] = 1;
            }

            JArray viewers = new JArray();
            foreach (string name in consolidated.Keys)
            {
                JObject viewer = new JObject();
                viewer["displayName"] = name;
                viewer["count"] = Convert.ToInt32(consolidated[name]);
                viewers.Add(viewer);
            }

            JObject result = new JObject();
            result["action"] = "updateAttendance";
            result["viewers"] = viewers;
            result["totalViewers"] = names.Count;
            return result;
        }

        internal static void SendAttendance(string apiUrl, string room)
        {
            Logging.LogDebug("Send attendance " + room);
            JObject message = GetAttendanceMessage(room);
            List<string> connectionIds = Connection.GetConnectionIds(room);
            Message.SendMessages(apiUrl, connectionIds, room, message);
            Logging.LogDebug("Attendance sent " + room);
        }


        internal static void Delete(string apiUrl, string room, string connectionId)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table chatTable = Table.LoadTable(client, "connections");
            Document doc = new Document();
            doc["room"] = room;
            doc["connectionId"] = connectionId;
            chatTable.DeleteItemAsync(doc).Wait();
            SendAttendance(apiUrl, room);
        }

        internal static void Delete(string apiUrl, string connectionId)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            ScanRequest request = new ScanRequest
            {
                TableName = "connections",
                FilterExpression = "connectionId = :connectionId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":connectionId", new AttributeValue { S = connectionId } } },
                ProjectionExpression = "room, connectionId",
            };
            ScanResponse response = client.ScanAsync(request).Result;
            foreach (Dictionary<string, AttributeValue> item in response.Items) Delete(apiUrl, item["room"].S, item["connectionId"].S);
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
            foreach (Dictionary<string, AttributeValue> item in response.Items) Delete("", item["room"].S, item["connectionId"].S);
        }


    }
}
