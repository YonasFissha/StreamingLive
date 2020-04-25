﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Controls
{
    public partial class Sidebar : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            AdminHolder.Visible = AppUser.Current.Role.Name == "admin";
        }
    }
}