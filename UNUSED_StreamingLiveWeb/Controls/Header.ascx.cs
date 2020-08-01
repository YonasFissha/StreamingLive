using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.Controls
{
    public partial class Header : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (AppUser.Current.IsAuthenticated) LoginLit.Text = $"<a href=\"javascript:toggleUserMenu();\"><i class=\"fas fa-user\"></i> &nbsp;{AppUser.Current.UserData.DisplayName} ({AppUser.Current.Site.KeyName}) <i class=\"fas fa-caret-down\"></i></a>";
        }
    }
}