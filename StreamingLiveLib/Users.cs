using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;


namespace StreamingLiveLib
{
    public class Users : List<User>
    {
		#region Constructors
		public Users() { }

		public Users(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new User(row));
		}
		#endregion

		#region Methods

		public static Users LoadBySiteId(int siteId)
		{
			string sql = "SELECT u.*  FROM Roles r INNER JOIN Users u on u.Id=r.UserId WHERE r.SiteId=@SiteId";
			return Users.Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@SiteId", siteId) });
		}

		public static Users Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Users(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Users Load(int[] ids)
		{
			if (ids.Length == 0) return new Users();
			else return Load("SELECT * FROM Users WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Users LoadAll()
		{
			return Load("SELECT * FROM Users", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (User user in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { user.Save(); }
					finally { sem.Release(); }
				});
				tasks.Add(t);
			}
			await System.Threading.Tasks.Task.WhenAll(tasks.ToArray());
		}

		public void SaveAll(bool waitForId = true)
		{
			MySqlConnection conn = DbHelper.Connection;
			try
			{
				conn.Open();
				DbHelper.SetContextInfo(conn);
				foreach (User user in this)
				{
					MySqlCommand cmd = user.GetSaveCommand(conn);
					user.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (User user in this) result.Add(user.Id);
			return result.ToArray();
		}

		public User GetById(int id)
		{
			foreach (User user in this) if (user.Id == id) return user;
			return null;
		}

		public Users GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Users result = new Users();
			foreach (User user in this) if (idList.Contains(user.Id)) result.Add(user);
			return result;
		}

		public Users Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Users result = new Users();
			foreach (var i in sortedList) { result.Add((User)i); }
			return result;
		}

		#endregion
	}
}
