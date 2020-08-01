using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP
{
    public partial class Welcome : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string url = "https://" + AppUser.Current.Site.KeyName + ".streaminglive.church/";
            SiteLink.Text = $"<a href=\"{url}\" target=\"_blank\">{url}</a>";
        }
    }
}