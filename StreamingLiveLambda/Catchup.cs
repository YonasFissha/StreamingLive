using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using Amazon.ApiGatewayManagementApi;
using Amazon.ApiGatewayManagementApi.Model;
using Amazon.DynamoDBv2.DocumentModel;
using System.Threading.Tasks;

namespace StreamingLiveLambda
{
    public class Catchup
    {

        internal static void Store(string room, JObject message)
        {
            Logging.LogDebug("Storing Catchup - " + room);
            JArray messages = GetCatchup(room);

            Logging.LogDebug("Catchup Message Count - " + messages.Count.ToString());
            //this just needs to run periodically.  
            messages.Add(message);

            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table table = Table.LoadTable(client, "catchup");
            Document doc = new Document();
            doc["room"] = room;
            doc["messages"] = messages.ToString(Newtonsoft.Json.Formatting.None);
            doc["ts"] = DateTime.UtcNow.Ticks;
            doc["prettyTS"] = DateTime.Now.ToString();
            Task<Document> t = table.PutItemAsync(doc);
            t.Wait();
        }

        internal static JArray GetCatchup(string room)
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            JArray result = new JArray();
            QueryRequest request = new QueryRequest
            {
                TableName = "catchup",
                KeyConditionExpression = "room = :room",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":room", new AttributeValue { S = room } } },
                ProjectionExpression = "messages",
            };
            QueryResponse response = client.QueryAsync(request).Result;
            if (response.Items.Count > 0) result = JArray.Parse(response.Items[0]["messages"].S);
            
            double threshold = DateTime.UtcNow.AddMinutes(-30).Ticks;
            for (int i = result.Count - 1; i >= 0; i--)
            {
                if (i > 19) result.RemoveAt(i);
                else
                {
                    try
                    {
                        if (Convert.ToDouble(result[i]["ts"]) < threshold) result.RemoveAt(i);
                    }
                    catch { }
                }
            }

            return result;
        }

        internal static void SendCatchup(string serviceUrl, string connectionId, string room, JArray messages)
        {
            JObject message = new JObject() { { "action", "catchup" }, { "room", room }, { "messages", messages } };
            MemoryStream stream = new MemoryStream(UTF8Encoding.UTF8.GetBytes(message.ToString(Newtonsoft.Json.Formatting.None)));
            AmazonApiGatewayManagementApiConfig config = new AmazonApiGatewayManagementApiConfig() { ServiceURL = serviceUrl };
            AmazonApiGatewayManagementApiClient client = new AmazonApiGatewayManagementApiClient(config);
            PostToConnectionRequest postReq = new PostToConnectionRequest() { ConnectionId = connectionId, Data = stream };
            client.PostToConnectionAsync(postReq);
        }


        internal static void Delete(string room)
        {
            Logging.LogDebug("Deleting catchup:" + room);
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            Table catchup = Table.LoadTable(client, "catchup");
            Document doc = new Document();
            doc["room"] = room;
            catchup.DeleteItemAsync(doc).Wait();
        }

        internal static void Cleanup()
        {
            Logging.LogDebug("Cleaning catchup");
            AmazonDynamoDBClient client = new AmazonDynamoDBClient();
            DateTime threshold = DateTime.UtcNow.AddMinutes(-30);

            Logging.LogDebug("TS:" + threshold.Ticks.ToString());
            ScanRequest request = new ScanRequest
            {
                TableName = "catchup",
                FilterExpression = "ts < :ts",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> { { ":ts", new AttributeValue { N = threshold.Ticks.ToString() } } },
                ProjectionExpression = "room"
            };
            ScanResponse response = client.ScanAsync(request).Result;
            Logging.LogDebug("Pending Delete Count:" + response.Items.Count.ToString());

            Logging.LogDebug(Newtonsoft.Json.JsonConvert.SerializeObject(response.Items));

            Table catchupTable = Table.LoadTable(client, "catchup");
            foreach (Dictionary<string, AttributeValue> item in response.Items) Delete(item["room"].S);
        }


    }
}
