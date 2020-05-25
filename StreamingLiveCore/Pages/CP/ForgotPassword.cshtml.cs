using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StreamingLiveCore.Pages.CP
{
    public class ForgotPasswordModel : PageModel
    {
        [BindProperty]
        public string Email { get; set; }
        public string OutputMessage = "";

        public void OnGet()
        {

        }

        public void OnPostReset()
        {
            StreamingLiveLib.User user = StreamingLiveLib.User.LoadByEmail(Email);
            if (user == null) OutputMessage = Utils.FormatMessage("Invalid email address.", true);
            else
            {
                string guid = user.SetResetGuid();
                string body = "<p>Please click the <a href=\"/cp/login.aspx?guid=" + guid + "&ReturnUrl=%2fcp%2f\">here</a> to reset your StreamingLive.church password.</p>";
                StreamingLiveLib.Aws.EmailHelper.SendEmail(CachedData.SupportEmail, user.Email, "StreamingLive.church Password Reset Request", body);
                OutputMessage = Utils.FormatMessage("Password reset instructions have been sent to " + user.Email, false);
            }
        }

    }
}