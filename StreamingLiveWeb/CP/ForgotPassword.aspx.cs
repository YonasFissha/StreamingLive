using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP
{
    public partial class ForgotPassword : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ResetButton_Click(object sender, EventArgs e)
        {
            StreamingLiveLib.User user = StreamingLiveLib.User.LoadByEmail(EmailText.Text);
            if (user == null) OutputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">Invalid email address.</div>";
            else
            {
                string guid = user.SetResetGuid();
                string body = "<p>Please click the <a href=\"" + CachedData.BaseUrl.Replace("old.", "") + "/cp/login.aspx?guid=" + guid + "&ReturnUrl=%2fcp%2f\">here</a> to reset your StreamingLive.church password.</p>";
                StreamingLiveLib.Aws.EmailHelper.SendEmail("support@streaminglive.church", user.Email, "StreamingLive.church Password Reset Request", body);
                OutputLit.Text = "<div class=\"alert alert-success\" role=\"alert\">Password reset instructions have been sent to " + user.Email + "</div>";
            }

        }
    }
}