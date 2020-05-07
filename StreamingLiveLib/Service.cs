using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;

namespace StreamingLiveLib
{
	public class Service
	{
		#region Declarations
		public int Id { get; set; }
		public int SiteId { get; set; }
		public DateTime ServiceTime { get; set; }
		public int EarlyStart { get; set; }
		public int Duration { get; set; }
		public int ChatBefore { get; set; }
		public int ChatAfter { get; set; }
		public string Provider { get; set; }
		public string ProviderKey { get; set; }
		public string VideoUrl { get; set; }
		public int TimezoneOffset { get; set; }
		public bool Recurring { get; set; }
		#endregion

		#region Constructors
		public Service()
		{
		}

		public Service(DataRow row)
		{
			if (row.Table.Columns.Contains("Id")) Id = Convert.ToInt32(row["Id"]);
			if (row.Table.Columns.Contains("SiteId")) SiteId = Convert.ToInt32(row["SiteId"]);
			if (row.Table.Columns.Contains("ServiceTime")) ServiceTime = Convert.ToDateTime(row["ServiceTime"]);
			if (row.Table.Columns.Contains("EarlyStart")) EarlyStart = Convert.ToInt32(row["EarlyStart"]);
			if (row.Table.Columns.Contains("Duration")) Duration = Convert.ToInt32(row["Duration"]);
			if (row.Table.Columns.Contains("ChatBefore")) ChatBefore = Convert.ToInt32(row["ChatBefore"]);
			if (row.Table.Columns.Contains("ChatAfter")) ChatAfter = Convert.ToInt32(row["ChatAfter"]);
			if (row.Table.Columns.Contains("Provider")) Provider = Convert.ToString(row["Provider"]);
			if (row.Table.Columns.Contains("ProviderKey")) ProviderKey = Convert.ToString(row["ProviderKey"]);
			if (row.Table.Columns.Contains("VideoUrl")) VideoUrl = Convert.ToString(row["VideoUrl"]);
			if (row.Table.Columns.Contains("TimezoneOffset")) TimezoneOffset = Convert.ToInt32(row["TimezoneOffset"]);
			if (row.Table.Columns.Contains("Recurring")) Recurring = Convert.ToBoolean(row["Recurring"]);
		}
		#endregion


		#region Methods

		public static Service Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			Services services = Services.Load(sql, commandType, parameters);
			return (services.Count == 0) ? null : services[0];
		}

		public static Service Load(int id)
		{
			return Load("SELECT * FROM Services WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public static Service Load(int id, int siteId)
		{
			return Load("SELECT * FROM Services WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id), new SqlParameter("@SiteId", siteId) });
		}

		internal SqlCommand GetSaveCommand(SqlConnection conn)
		{
			SqlCommand cmd = new SqlCommand("SaveService", conn) { CommandType = CommandType.StoredProcedure };

			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@SiteId", (object)SiteId);
			cmd.Parameters.AddWithValue("@ServiceTime", (object)ServiceTime);
			cmd.Parameters.AddWithValue("@EarlyStart", (object)EarlyStart);
			cmd.Parameters.AddWithValue("@Duration", (object)Duration);
			cmd.Parameters.AddWithValue("@ChatBefore", (object)ChatBefore);
			cmd.Parameters.AddWithValue("@ChatAfter", (object)ChatAfter);
			cmd.Parameters.AddWithValue("@Provider", (object)Provider);
			cmd.Parameters.AddWithValue("@ProviderKey", (object)ProviderKey);
			cmd.Parameters.AddWithValue("@VideoUrl", (object)VideoUrl);
			cmd.Parameters.AddWithValue("@TimezoneOffset", (object)TimezoneOffset);
			cmd.Parameters.AddWithValue("@Recurring", (object)Recurring);
			return cmd;
		}

		public int Save()
		{
			SqlCommand cmd = GetSaveCommand(DbHelper.Connection);
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
			DbHelper.ExecuteNonQuery("DELETE Services WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public static void Delete(int id, int siteId)
		{
			DbHelper.ExecuteNonQuery("DELETE Services WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id), new SqlParameter("@SiteId", siteId) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
