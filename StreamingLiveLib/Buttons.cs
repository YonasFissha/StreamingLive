using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamingLiveLib
{
    public class Buttons : List<Button>
	{
		#region Constructors
		public Buttons() { }

		public Buttons(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Button(row));
		}
		#endregion

		#region Methods

		public void UpdateSort()
		{
			int i = 1;
			foreach (Button button in this.Sort("Sort", false))
			{
				button.Sort = i;
				i++;
				button.Save();
			}
		}

		public static Buttons LoadBySiteId(int siteId)
		{
			string sql = "SELECT * FROM Buttons WHERE SiteId=@SiteId ORDER BY Sort";
			return Load(sql, CommandType.Text, new SqlParameter[] { new SqlParameter("@SiteId", siteId) });
		}

		public static Buttons Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			return new Buttons(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Buttons Load(int[] ids)
		{
			if (ids.Length == 0) return new Buttons();
			else return Load("SELECT * FROM Buttons WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Buttons LoadAll()
		{
			return Load("SELECT * FROM Buttons", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Button button in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { button.Save(); }
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
				foreach (Button button in this)
				{
					SqlCommand cmd = button.GetSaveCommand(conn);
					button.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Button button in this) result.Add(button.Id);
			return result.ToArray();
		}

		public Button GetById(int id)
		{
			foreach (Button button in this) if (button.Id == id) return button;
			return null;
		}

		public Buttons GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Buttons result = new Buttons();
			foreach (Button button in this) if (idList.Contains(button.Id)) result.Add(button);
			return result;
		}

		public Buttons Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Buttons result = new Buttons();
			foreach (var i in sortedList) { result.Add((Button)i); }
			return result;
		}

		#endregion
	}
}
