using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace StreamingLiveLib
{
	public class Services : List<Service>
	{
		#region Constructors
		public Services() { }

		public Services(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Service(row));
		}
		#endregion

		#region Methods

		public static Services LoadExpired()
		{
			DateTime threshold = DateTime.UtcNow.AddHours(-6);
			return Load("SELECT * FROM Services WHERE ServiceTime<@ServiceTime", CommandType.Text, new SqlParameter[] { new SqlParameter("@ServiceTime", threshold) });
		}

		public static DataTable LoadUpcoming()
		{
			string sql = "SELECT TOP 15 s.KeyName, ser.ServiceTime"
				+ " FROM services ser"
				+ " INNER JOIN Sites s ON s.id = ser.SiteId"
				+ " WHERE ServiceTime> getdate() and ProviderKey<>'zFOfmAHFKNw'"
				+ " order by ServiceTime";
			return DbHelper.FillDt(sql);
		}

		public static Services Load(string sql, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
		{
			return new Services(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Services Load(int[] ids)
		{
			if (ids.Length == 0) return new Services();
			else return Load("SELECT * FROM Services WHERE ID IN (" + String.Join(",", ids) + ")");
		}

		public static Services LoadAll()
		{
			return Load("SELECT * FROM Services", CommandType.Text, null);
		}

		public static Services LoadBySiteId(int siteId)
		{
			return Load("SELECT * FROM Services WHERE SiteId=@SiteId", CommandType.Text, new SqlParameter[] { new SqlParameter("@SiteId", siteId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Service service in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { service.Save(); }
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
				foreach (Service service in this)
				{
					SqlCommand cmd = service.GetSaveCommand(conn);
					service.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}


		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Service service in this) result.Add(service.Id);
			return result.ToArray();
		}

		public Service GetById(int id)
		{
			foreach (Service service in this) if (service.Id == id) return service;
			return null;
		}

		public Services GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Services result = new Services();
			foreach (Service service in this) if (idList.Contains(service.Id)) result.Add(service);
			return result;
		}

		public Services Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Services result = new Services();
			foreach (var i in sortedList) { result.Add((Service)i); }
			return result;
		}

		#endregion
	}
}
