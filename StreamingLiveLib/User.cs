using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Security.Cryptography;

namespace StreamingLiveLib
{
    public partial class User
    {
		#region Declarations

		public int Id { get; set; }
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
				if (Convert.IsDBNull(row["Id"])) Id = 0;
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
			return Load("SELECT * FROM Users WHERE Email=@Email", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Email", email) });
		}

		public static User LoadByResetGuid(string resetGuid)
		{
			return Load("SELECT * FROM Users WHERE ResetGuid=@ResetGuid", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ResetGuid", resetGuid) });
		}

		public static User Login(string email, string password)
		{
			string hashedPassword = HashPassword(password);
			return Load("SELECT * FROM Users WHERE Email=@Email AND Password=@Password", CommandType.Text, new MySqlParameter[] {
				new MySqlParameter("@Email", email),
				new MySqlParameter("@Password", hashedPassword)
			});
		}

		public static User Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Users users = Users.Load(sql, commandType, parameters);
			return (users.Count == 0) ? null : users[0];
		}

		public static User Load(int id)
		{
			return Load("SELECT * FROM Users WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			MySqlCommand cmd = (Id == 0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
			cmd.Parameters.AddWithValue("@Id", (object)Id);
			cmd.Parameters.AddWithValue("@Email", (Email==null) ? System.DBNull.Value : (object)Email);
			cmd.Parameters.AddWithValue("@DisplayName", (DisplayName == null) ? System.DBNull.Value : (object)DisplayName);
			cmd.Parameters.AddWithValue("@Password", (Password==null) ? System.DBNull.Value : (object)Password);
			cmd.Parameters.AddWithValue("@ResetGuid", (ResetGuid == null) ? System.DBNull.Value : (object)ResetGuid);
			return cmd;
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Users (Email, DisplayName, Password, ResetGuid) VALUES (@Email, @DisplayName, @Password, @ResetGuid); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) { CommandType = CommandType.Text };
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Users SET Email=@Email, DisplayName=@DisplayName, Password=@Password, ResetGuid=@ResetGuid WHERE Id=@Id; SELECT @Id;";
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
			DbHelper.ExecuteNonQuery("DELETE FROM Users WHERE Id=@Id", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id) });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(User).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
