using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;

namespace StreamingLiveLib
{
    public class Sites:List<Site>
    {
		#region Constructors
		public Sites() { }

		public Sites(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Site(row));
		}
		#endregion

		#region Methods

		public static Sites Search(string term)
		{
			term = "%" + term.Split('.')[0] + "%";
			return Load("SELECT * FROM Sites WHERE KeyName LIKE @KeyName ORDER BY KeyName", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@KeyName", term) });
		}

		public static Sites LoadRecent()
		{
			return Load("SELECT * FROM Sites ORDER BY Id Desc LIMIT 15");
		}

		public static Sites LoadByUserId(int userId)
		{
			string sql = "SELECT s.* FROM Roles r INNER JOIN Sites s ON s.Id = r.SiteId WHERE r.UserId = @UserId";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@UserId", userId) });
		}

		public static Sites Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Sites(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Sites Load(int[] ids)
		{
			if (ids.Length == 0) return new Sites();
			else return Load("SELECT * FROM Sites WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Sites LoadAll()
		{
			return Load("SELECT * FROM Sites", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Site site in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { site.Save(); }
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
				foreach (Site site in this)
				{
					MySqlCommand cmd = site.GetSaveCommand(conn);
					site.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Site site in this) result.Add(site.Id);
			return result.ToArray();
		}

		public Site GetById(int id)
		{
			foreach (Site site in this) if (site.Id == id) return site;
			return null;
		}

		public Sites GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Sites result = new Sites();
			foreach (Site site in this) if (idList.Contains(site.Id)) result.Add(site);
			return result;
		}

		public Sites Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Sites result = new Sites();
			foreach (var i in sortedList) { result.Add((Site)i); }
			return result;
		}

		#endregion

	}
}
