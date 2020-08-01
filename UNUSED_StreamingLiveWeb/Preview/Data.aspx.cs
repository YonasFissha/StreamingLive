using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.Preview
{
    public partial class Data : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            StreamingLiveLib.Site site = StreamingLiveLib.Site.LoadByKeyName(Request["key"]);
            OutputLit.Text = site.LoadJson();
            Response.ContentType = "application/json";
        }
    }
}