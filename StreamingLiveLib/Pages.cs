using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace StreamingLiveLib
{
    public class Pages:List<Page>
    {
		#region Constructors
		public Pages() { }

		public Pages(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Page(row));
		}
		#endregion

		#region Methods
		public static Pages LoadBySiteId(int siteId)
		{
			string sql = "SELECT * FROM Pages WHERE SiteId=@SiteId ORDER BY Name";
			return Load(sql, CommandType.Text, new SqlParameter[] { new SqlParameter("@SiteId", siteId) });
		}

		public static Pages Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			return new Pages(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Pages Load(int[] ids)
		{
			if (ids.Length == 0) return new Pages();
			else return Load("SELECT * FROM Pages WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Pages LoadAll()
		{
			return Load("SELECT * FROM Pages", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Page page in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { page.Save(); }
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
				foreach (Page page in this)
				{
					SqlCommand cmd = page.GetSaveCommand(conn);
					page.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Page page in this) result.Add(page.Id.Value);
			return result.ToArray();
		}

		public Page GetById(int id)
		{
			foreach (Page page in this) if (page.Id == id) return page;
			return null;
		}

		public Pages GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Pages result = new Pages();
			foreach (Page page in this) if (idList.Contains(page.Id.Value)) result.Add(page);
			return result;
		}

		public Pages Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Pages result = new Pages();
			foreach (var i in sortedList) { result.Add((Page)i); }
			return result;
		}

		#endregion
	}
}
