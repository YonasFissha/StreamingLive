using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    public class Tab
    {
		#region Declarations
		public int Id { get; set; }
		public int SiteId { get; set; }
		public string Url { get; set; }
		public string Text { get; set; }
		public string TabType { get; set; }
		public string TabData { get; set; }
		public string Icon { get; set; }
		public int Sort { get; set; }
		#endregion

		#region Constructors
		public Tab()
		{
		}

		public Tab(DataRow row)
		{
			if (row.Table.Columns.Contains("Id")) Id = Convert.ToInt32(row["Id"]);
			if (row.Table.Columns.Contains("SiteId")) SiteId = Convert.ToInt32(row["SiteId"]);
			if (row.Table.Columns.Contains("Url")) Url = Convert.ToString(row["Url"]);
			if (row.Table.Columns.Contains("Text")) Text = Convert.ToString(row["Text"]);
			if (row.Table.Columns.Contains("TabType")) TabType = Convert.ToString(row["TabType"]);
			if (row.Table.Columns.Contains("TabData")) TabData = Convert.ToString(row["TabData"]);
			if (row.Table.Columns.Contains("Icon")) Icon = Convert.ToString(row["Icon"]);
			if (row.Table.Columns.Contains("Sort")) Sort = Convert.ToInt32(row["Sort"]);
		}
		#endregion

		#region Methods

		public static Tab Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			if (string.IsNullOrEmpty(sql))
			{
				throw new ArgumentException("message", nameof(sql));
			}

			if (parameters is null)
			{
				throw new ArgumentNullException(nameof(parameters));
			}

			Tabs tabs = Tabs.Load(sql, commandType, parameters);
			return (tabs.Count == 0) ? null : tabs[0];
		}

		public static Tab Load(int id)
		{
			return Load("SELECT * FROM Tabs WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public static Tab Load(int id, int siteId)
		{
			return Load("SELECT * FROM Tabs WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id), new SqlParameter("@SiteId", siteId) });
		}


		internal SqlCommand GetSaveCommand(SqlConnection conn)
		{
			SqlCommand cmd = new SqlCommand("SaveTab", conn) { CommandType = CommandType.StoredProcedure };
			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@SiteId", (object)SiteId);
			cmd.Parameters.AddWithValue("@Url", (object)Url);
			cmd.Parameters.AddWithValue("@Text", (object)Text);
			cmd.Parameters.AddWithValue("@TabType", (object)TabType);
			cmd.Parameters.AddWithValue("@TabData", (object)TabData);
			cmd.Parameters.AddWithValue("@Icon", (object)Icon);
			cmd.Parameters.AddWithValue("@Sort", (object)Sort);
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
			DbHelper.ExecuteNonQuery("DELETE Tabs WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public static void Delete(int id, int siteId)
		{
			DbHelper.ExecuteNonQuery("DELETE Tabs WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id), new SqlParameter("@SiteId", siteId) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Tab).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
