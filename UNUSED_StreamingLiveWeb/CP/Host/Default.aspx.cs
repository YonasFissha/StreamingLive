using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Host
{
    public partial class Default : System.Web.UI.Page
    {
        public string KeyName = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            KeyName = StreamingLiveWeb.AppUser.Current.Site.KeyName;
        }
    }
}