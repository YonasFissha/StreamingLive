using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request["Guid"] != null) LoginGuid();
        }

        private void LoginGuid()
        {
            StreamingLiveLib.User user = StreamingLiveLib.User.LoadByResetGuid(Request["guid"]);
            if (user == null) OutputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">Invalid token.  Please login or reset password again.</div>";
            else
            {
                AppUser.Login(user);
                FormsAuthentication.RedirectFromLoginPage(user.Email, false);
            }
        }


        protected void SigninButton_Click(object sender, EventArgs e)
        {
            StreamingLiveLib.User user = StreamingLiveLib.User.Login(EmailText.Text, PasswordText.Text);

            if (user == null) OutputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">Invalid email address / password combination.</div>";
            else
            {
                user.ResetGuid = Guid.NewGuid().ToString();
                user.Save();
                AppUser.Login(user);
                FormsAuthentication.RedirectFromLoginPage(user.ResetGuid, false);
            }
        }
    }
}