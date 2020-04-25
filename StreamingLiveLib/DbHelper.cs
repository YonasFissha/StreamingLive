
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace StreamingLiveLib
{
    public partial class DbHelper
    {
        private static string _connectionString = System.Configuration.ConfigurationManager.AppSettings["ConnectionString"];

        public static string ConnectionString
        {
            get { return _connectionString; }
            set { _connectionString = value; }
        }

        public static SqlConnection Connection
        {
            get { return new SqlConnection(_connectionString); }
        }

        public static void BulkInsert(DataTable dt, string tableName)
        {
            SqlConnection conn = DbHelper.Connection;
            try
            {
                conn.Open();
                SqlBulkCopy bc = new SqlBulkCopy(conn);
                bc.DestinationTableName = tableName;
                bc.WriteToServer(dt);
            }
            finally
            {
                conn.Close();
            }
        }

        public static DataTable FillDt(string sql)
        {
            SqlDataAdapter adapter = new SqlDataAdapter(sql, Connection);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            return dt;
        }

        public static DataTable ExecuteQuery(string sql, System.Data.CommandType commandType, SqlParameter[] parameters)
        {
            SqlDataAdapter adapter = new SqlDataAdapter(sql, Connection);
            adapter.SelectCommand.CommandType = commandType;
            if (parameters != null)
            {
                foreach (SqlParameter parameter in parameters) adapter.SelectCommand.Parameters.Add(parameter);
            }
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            return dt;
        }

        public static Object ExecuteScalar(string sql, System.Data.CommandType commandType, SqlParameter[] parameters)
        {
            object result = null;
            SqlCommand cmd = new SqlCommand(sql, Connection);
            cmd.CommandType = commandType;
            if (parameters != null) foreach (SqlParameter parameter in parameters) cmd.Parameters.Add(parameter);
            try
            {
                cmd.Connection.Open();
                result = cmd.ExecuteScalar();
            }
            finally { cmd.Connection.Close(); }
            return result;
        }

        public static void ExecuteNonQuery(string sql, System.Data.CommandType commandType, SqlParameter[] parameters)
        {
            SqlCommand cmd = new SqlCommand(sql, Connection);
            cmd.CommandType = commandType;
            if (parameters != null) foreach (SqlParameter parameter in parameters) cmd.Parameters.Add(parameter);
            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
            }
            finally { cmd.Connection.Close(); }
        }

        public static void SetContextInfo(SqlConnection con)
        {
        }

    }
}
