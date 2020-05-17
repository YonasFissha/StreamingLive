using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace StreamingLiveLib
{
	public partial class Site
	{
		#region Declarations

		public int Id { get; set; }
		public string KeyName { get; set; }
		public string HomePageUrl { get; set; }
		public string LogoUrl { get; set; }
		public string PrimaryColor { get; set; }
		public string ContrastColor { get; set; }
		public string HeaderColor { get; set; }
		public DateTime RegistrationDate { get; set; }
		#endregion

		#region Constructors
		public Site()
		{
		}


		public string GetCss()
		{
			return ":root { --primaryColor: " + this.PrimaryColor + "; --contrastColor: " + this.ContrastColor + "; --headerColor: " + this.HeaderColor + "; }";
		}

		public string LoadJson()
		{
			StreamingLiveLib.Buttons buttons = StreamingLiveLib.Buttons.LoadBySiteId(this.Id);
			StreamingLiveLib.Tabs tabs = StreamingLiveLib.Tabs.LoadBySiteId(this.Id);
			StreamingLiveLib.Services services = StreamingLiveLib.Services.LoadBySiteId(this.Id);
			JObject data = new JObject();

			data["colors"] = new JObject()
			{
				{ "primary", this.PrimaryColor },
				{ "contrast", this.ContrastColor },
				{ "header", this.HeaderColor }
			};

			data["logo"] = new JObject()
			{
				{ "url", this.HomePageUrl },
				{ "image", this.LogoUrl }
			};

			JArray buttonArray = new JArray();
			foreach (StreamingLiveLib.Button button in buttons) buttonArray.Add(new JObject() {
				{ "text", button.Text }, { "url", button.Url }
			});
			data["buttons"] = buttonArray;

			JArray tabArray = new JArray();
			foreach (StreamingLiveLib.Tab tab in tabs) tabArray.Add(new JObject() {
				{ "text", tab.Text }, {"icon", tab.Icon}, { "url", tab.Url }, {"type", tab.TabType}, {"data", tab.TabData}
			});
			data["tabs"] = tabArray;

			JArray serviceArray = new JArray();
			foreach (StreamingLiveLib.Service service in services) serviceArray.Add(new JObject() {
				{ "videoUrl", service.VideoUrl }, 
				{ "serviceTime", service.ServiceTime.ToString("yyyy-MM-dd") + "T" + service.ServiceTime.ToString("HH:mm") },
				{ "duration", Utils.GetDisplayDuration(service.Duration) },
				{ "earlyStart", Utils.GetDisplayDuration(service.EarlyStart) },
				{ "chatBefore", Utils.GetDisplayDuration(service.ChatBefore) },
				{ "chatAfter", Utils.GetDisplayDuration(service.ChatAfter) },
				{ "provider", service.Provider },
				{ "providerKey", service.ProviderKey }
			});
			data["services"] = serviceArray;


			string result = data.ToString(Formatting.Indented);

			return result;
		}

		

		private void GetButtons(StreamingLiveLib.Buttons buttons)
		{
			
		}


		public Site(DataRow row)
		{
			if (row.Table.Columns.Contains("Id")) Id = Convert.ToInt32(row["Id"]);
			if (row.Table.Columns.Contains("KeyName")) KeyName = Convert.ToString(row["KeyName"]);
			if (row.Table.Columns.Contains("HomePageUrl")) HomePageUrl = Convert.ToString(row["HomePageUrl"]);
			if (row.Table.Columns.Contains("LogoUrl")) LogoUrl = Convert.ToString(row["LogoUrl"]);
			if (row.Table.Columns.Contains("PrimaryColor")) PrimaryColor = Convert.ToString(row["PrimaryColor"]);
			if (row.Table.Columns.Contains("ContrastColor")) ContrastColor = Convert.ToString(row["ContrastColor"]);
			if (row.Table.Columns.Contains("HeaderColor")) HeaderColor = Convert.ToString(row["HeaderColor"]);
			if (row.Table.Columns.Contains("RegistrationDate")) RegistrationDate = Convert.ToDateTime(row["RegistrationDate"]);
		}
		#endregion

		#region Methods

		public static Site LoadByKeyName(string keyName)
		{
			return Load("SELECT * FROM Sites WHERE KeyName=@KeyName", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@KeyName", keyName) });
		}

		public static Site Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Sites sites = Sites.Load(sql, commandType, parameters);
			return (sites.Count == 0) ? null : sites[0];
		}

		public static Site Load(int id)
		{
			return Load("SELECT * FROM Sites WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			MySqlCommand cmd = (Id == 0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@KeyName", (object)KeyName);
			cmd.Parameters.AddWithValue("@HomePageUrl", (object)HomePageUrl);
			cmd.Parameters.AddWithValue("@LogoUrl", (object)LogoUrl);
			cmd.Parameters.AddWithValue("@PrimaryColor", (object)PrimaryColor);
			cmd.Parameters.AddWithValue("@ContrastColor", (object)ContrastColor);
			cmd.Parameters.AddWithValue("@HeaderColor", (object)HeaderColor);
			cmd.Parameters.AddWithValue("@RegistrationDate", (object)RegistrationDate);
			return cmd;
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Sites (KeyName, HomePageUrl, LogoUrl, PrimaryColor, ContrastColor, HeaderColor, RegistrationDate) VALUES (@KeyName, @HomePageUrl, @LogoUrl, @PrimaryColor, @ContrastColor, @HeaderColor, @RegistrationDate); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Sites SET KeyName=@KeyName, HomePageUrl=@HomePageUrl, LogoUrl=@LogoUrl, PrimaryColor=@PrimaryColor, ContrastColor=@ContrastColor, HeaderColor=@HeaderColor, RegistrationDate=@RegistrationDate WHERE Id=@Id; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			return cmd;
		}

		public int Save()
		{
			MySqlCommand cmd = GetSaveCommand(DbHelper.Connection);
			cmd.Connection.Open();
			try
			{
				DbHelper.SetContextInfo(cmd.Connection);
				Id = Convert.ToInt32(cmd.ExecuteScalar());
			}
			catch (Exception ex) { throw ex; }
			finally { cmd.Connection.Close(); }
			return Id;
		}

		public static void Delete(int id)
		{
			DbHelper.ExecuteNonQuery("DELETE FROM Sites WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
