using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Security.Cryptography;

namespace StreamingLiveLib
{
	public partial class Site
	{
		#region Declarations

		public int? Id { get; set; }
		public string KeyName { get; set; }
		#endregion

		#region Constructors
		public Site()
		{
		}

		public Site(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) Id = null;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("KeyName")) KeyName = Convert.ToString(row["KeyName"]);
		}
		#endregion





		#region Methods

		public static Site LoadByKeyName(string keyName)
		{
			return Load("SELECT * FROM Sites WHERE KeyName=@KeyName", CommandType.Text, new SqlParameter[] { new SqlParameter("@KeyName", keyName) });
		}

		public static Site Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			Sites sites = Sites.Load(sql, commandType, parameters);
			return (sites.Count == 0) ? null : sites[0];
		}

		public static Site Load(int id)
		{
			return Load("SELECT * FROM Sites WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		internal SqlCommand GetSaveCommand(SqlConnection conn)
		{
			SqlCommand cmd = new SqlCommand("SaveSite", conn) { CommandType = CommandType.StoredProcedure };
			cmd.Parameters.AddWithValue("@Id", (Id == null) ? System.DBNull.Value : (object)Id.Value);
			cmd.Parameters.AddWithValue("@KeyName", (KeyName == null) ? System.DBNull.Value : (object)KeyName);

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
			DbHelper.ExecuteNonQuery("DELETE Sites WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
