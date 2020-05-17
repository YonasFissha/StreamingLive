using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;

namespace StreamingLiveLib
{
    public class Role
    {
		#region Declarations

		public int Id { get; set; }
		public int SiteId { get; set; }
		public int UserId { get; set; }
		public string Name { get; set; }
		#endregion

		#region Constructors
		public Role()
		{
		}

		public Role(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) Id = 0;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("SiteId")) SiteId = Convert.ToInt32(row["SiteId"]);
			if (row.Table.Columns.Contains("UserId")) UserId = Convert.ToInt32(row["UserId"]);
			if (row.Table.Columns.Contains("Name")) Name = Convert.ToString(row["Name"]);
		}
		#endregion





		#region Methods

		public static Role Load(int userId, int siteId)
		{
			return Load("SELECT * FROM Roles WHERE UserId=@UserId AND SiteId=@SiteId", CommandType.Text, new MySqlParameter[] {
				new MySqlParameter("@UserId", userId),
				new MySqlParameter("@SiteId", siteId)
			});
		}

		public static Role Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Roles roles = Roles.Load(sql, commandType, parameters);
			return (roles.Count == 0) ? null : roles[0];
		}

		public static Role Load(int id)
		{
			return Load("SELECT * FROM Roles WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			MySqlCommand cmd = (Id == 0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@SiteId", (object)SiteId);
			cmd.Parameters.AddWithValue("@UserId", (object)UserId);
			cmd.Parameters.AddWithValue("@Name", (Name == null) ? System.DBNull.Value : (object)Name);
			return cmd;
		}


		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Roles (SiteId, UserId, Name) VALUES (@SiteId, @UserId, @Name); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Roles SET SiteId=@SiteId, UserId=@UserId, Name=@Name WHERE Id=@Id; SELECT @Id;";
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
			DbHelper.ExecuteNonQuery("DELETE FROM Roles WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
