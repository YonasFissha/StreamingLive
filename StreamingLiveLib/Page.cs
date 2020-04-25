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
    public class Page
    {
		#region Declarations

		public int? Id { get; set; }
		public int? SiteId { get; set; }
		public string Name { get; set; }
		public DateTime? LastModified { get; set; }
		#endregion

		#region Constructors
		public Page()
		{
		}

		public Page(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) Id = null;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("SiteId")) SiteId = Convert.ToInt32(row["SiteId"]);
			if (row.Table.Columns.Contains("Name")) Name = Convert.ToString(row["Name"]);
			if (row.Table.Columns.Contains("LastModified"))
			{
				if (Convert.IsDBNull(row["LastModified"])) LastModified = null;
				else LastModified = Convert.ToDateTime(row["LastModified"]);
			}
		}
		#endregion





		#region Methods

		public static Page Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			Pages pages = Pages.Load(sql, commandType, parameters);
			return (pages.Count == 0) ? null : pages[0];
		}

		public static Page Load(int id)
		{
			return Load("SELECT * FROM Pages WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public static Page Load(int id, int siteId)
		{
			return Load("SELECT * FROM Pages WHERE Id=@Id AND SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id), new SqlParameter("@SiteId", siteId) });
		}

		internal SqlCommand GetSaveCommand(SqlConnection conn)
		{
			SqlCommand cmd = new SqlCommand("SavePage", conn) { CommandType = CommandType.StoredProcedure };
			cmd.Parameters.AddWithValue("@Id", (Id == null) ? System.DBNull.Value : (object)Id.Value);
			cmd.Parameters.AddWithValue("@SiteId", (SiteId == null) ? System.DBNull.Value : (object)SiteId.Value);
			cmd.Parameters.AddWithValue("@Name", (Name == null) ? System.DBNull.Value : (object)Name);
			cmd.Parameters.AddWithValue("@LastModified", (LastModified == null) ? System.DBNull.Value : (object)LastModified);

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
			return Id.Value;
		}

		public static void Delete(int id)
		{
			DbHelper.ExecuteNonQuery("DELETE Pages WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
