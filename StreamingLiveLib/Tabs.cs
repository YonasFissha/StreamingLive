using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    public class Tabs:List<Tab>
	{
		#region Constructors
		public Tabs() { }

		public Tabs(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Tab(row));
		}
		#endregion

		#region Methods
		public void UpdateSort()
		{
			int i = 1;
			foreach (Tab tab in this.Sort("Sort", false))
			{
				tab.Sort = i;
				i++;
				tab.Save();
			}
		}

		public static Tabs LoadBySiteId(int siteId)
		{
			string sql = "SELECT * FROM Tabs WHERE SiteId=@SiteId ORDER BY Sort";
			return Load(sql, CommandType.Text, new SqlParameter[] { new SqlParameter("@SiteId", siteId) });
		}

		public static Tabs Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			return new Tabs(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Tabs Load(int[] ids)
		{
			if (ids.Length == 0) return new Tabs();
			else return Load("SELECT * FROM Tabs WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Tabs LoadAll()
		{
			return Load("SELECT * FROM Tabs", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Tab tab in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { tab.Save(); }
					finally { sem.Release(); }
				});
				tasks.Add(t);
			}
			await System.Threading.Tasks.Task.WhenAll(tasks.ToArray());
		}

		public void SaveAll(bool waitForId = true)
		{
			SqlConnection conn = DbHelper.Connection;
			try
			{
				conn.Open();
				DbHelper.SetContextInfo(conn);
				foreach (Tab tab in this)
				{
					SqlCommand cmd = tab.GetSaveCommand(conn);
					tab.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Tab tab in this) result.Add(tab.Id);
			return result.ToArray();
		}

		public Tab GetById(int id)
		{
			foreach (Tab tab in this) if (tab.Id == id) return tab;
			return null;
		}

		public Tabs GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Tabs result = new Tabs();
			foreach (Tab tab in this) if (idList.Contains(tab.Id)) result.Add(tab);
			return result;
		}

		public Tabs Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Tabs result = new Tabs();
			foreach (var i in sortedList) { result.Add((Tab)i); }
			return result;
		}

		#endregion
	}
}
