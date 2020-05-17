using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace StreamingLiveLib
{
    public class Button
    {
		#region Declarations
		public int Id { get; set; }
		public int SiteId { get; set; }
		public string Url { get; set; }
		public string Text { get; set; }
		public int Sort { get; set; }
		#endregion

		#region Constructors
		public Button()
		{
		}

		public Button(DataRow row)
		{
			if (row.Table.Columns.Contains("Id")) Id = Convert.ToInt32(row["Id"]);
			if (row.Table.Columns.Contains("SiteId")) SiteId = Convert.ToInt32(row["SiteId"]);
			if (row.Table.Columns.Contains("Url")) Url = Convert.ToString(row["Url"]);
			if (row.Table.Columns.Contains("Text")) Text = Convert.ToString(row["Text"]);
			if (row.Table.Columns.Contains("Sort")) Sort = Convert.ToInt32(row["Sort"]);
		}
		#endregion

		#region Methods

		public static Button Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Buttons buttons = Buttons.Load(sql, commandType, parameters);
			return (buttons.Count == 0) ? null : buttons[0];
		}

		public static Button Load(int id)
		{
			return Load("SELECT * FROM Buttons WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		public static Button Load(int id, int siteId)
		{
			return Load("SELECT * FROM Buttons WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@SiteId", siteId) });
		}


		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			MySqlCommand cmd = (Id == 0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@SiteId", (object)SiteId);
			cmd.Parameters.AddWithValue("@Url", (object)Url);
			cmd.Parameters.AddWithValue("@Text", (object)Text);
			cmd.Parameters.AddWithValue("@Sort", (object)Sort);
			return cmd;
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Buttons (SiteId, Url, Text, Sort) VALUES (@SiteId, @Url, @Text, @Sort); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Buttons SET SiteId=@SiteId, Url=@Url, Text=@Text, Sort=@Sort WHERE Id=@Id; SELECT @Id;";
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
			DbHelper.ExecuteNonQuery("DELETE FROM Buttons WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		public static void Delete(int id, int siteId)
		{
			DbHelper.ExecuteNonQuery("DELETE FROM Buttons WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@SiteId", siteId) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Button).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
