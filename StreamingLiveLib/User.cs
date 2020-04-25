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
    public partial class User
    {
		#region Declarations

		public int? Id { get; set; }
		public string Email { get; set; }
		public string DisplayName { get; set; }
		public string Password { get; set; }
		public string ResetGuid { get; set; }
		private static string salt = System.Configuration.ConfigurationManager.AppSettings["PasswordSalt"];
		#endregion

		#region Constructors
		public User()
		{
		}

		public User(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) Id = null;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("Email")) Email = Convert.ToString(row["Email"]);
			if (row.Table.Columns.Contains("DisplayName")) DisplayName = Convert.ToString(row["DisplayName"]);
			if (row.Table.Columns.Contains("Password")) Password = Convert.ToString(row["Password"]);
			if (row.Table.Columns.Contains("ResetGuid")) ResetGuid = Convert.ToString(row["ResetGuid"]);
		}
		#endregion





		#region Methods
		public string SetResetGuid()
		{
			this.ResetGuid = Guid.NewGuid().ToString().Replace("-", "").ToLower();
			this.Save();
			return this.ResetGuid;
		}


		public static string HashPassword(string password)
		{
			SHA1CryptoServiceProvider hasher = new SHA1CryptoServiceProvider();
			byte[] textWithSaltBytes = Encoding.UTF8.GetBytes(string.Concat(password, salt));
			byte[] hashedBytes = hasher.ComputeHash(textWithSaltBytes);
			hasher.Clear();
			return Convert.ToBase64String(hashedBytes);
		}


		public static User LoadByEmail(string email)
		{
			return Load("SELECT * FROM Users WHERE Email=@Email", CommandType.Text, new SqlParameter[] { new SqlParameter("@Email", email) });
		}

		public static User LoadByResetGuid(string resetGuid)
		{
			return Load("SELECT * FROM Users WHERE ResetGuid=@ResetGuid", CommandType.Text, new SqlParameter[] { new SqlParameter("@ResetGuid", resetGuid) });
		}

		public static User Login(string email, string password)
		{
			string hashedPassword = HashPassword(password);
			return Load("SELECT * FROM Users WHERE Email=@Email AND Password=@Password", CommandType.Text, new SqlParameter[] {
				new SqlParameter("@Email", email),
				new SqlParameter("@Password", hashedPassword)
			});
		}

		public static User Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			Users users = Users.Load(sql, commandType, parameters);
			return (users.Count == 0) ? null : users[0];
		}

		public static User Load(int id)
		{
			return Load("SELECT * FROM Users WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		internal SqlCommand GetSaveCommand(SqlConnection conn)
		{
			SqlCommand cmd = new SqlCommand("SaveUser", conn) { CommandType = CommandType.StoredProcedure };
			cmd.Parameters.AddWithValue("@Id", (Id==null) ? System.DBNull.Value : (object)Id.Value);
			cmd.Parameters.AddWithValue("@Email", (Email==null) ? System.DBNull.Value : (object)Email);
			cmd.Parameters.AddWithValue("@DisplayName", (DisplayName == null) ? System.DBNull.Value : (object)DisplayName);
			cmd.Parameters.AddWithValue("@Password", (Password==null) ? System.DBNull.Value : (object)Password);
			cmd.Parameters.AddWithValue("@ResetGuid", (ResetGuid == null) ? System.DBNull.Value : (object)ResetGuid);
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
			DbHelper.ExecuteNonQuery("DELETE Users WHERE Id=@Id", CommandType.Text, new SqlParameter[] { new SqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
