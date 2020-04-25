using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.Controls
{
    public partial class HomeRegister : System.Web.UI.UserControl
    {
        protected void RegisterButton_Click(object sender, EventArgs e)
        {
            string[] errors = Validate();
            if (errors.Length == 0)
            {
                StreamingLiveLib.Site s = new StreamingLiveLib.Site() { KeyName = KeyNameText.Text.ToLower().Trim() };
                s.Save();

                StreamingLiveLib.User u = new StreamingLiveLib.User() { Email = EmailText.Text.ToLower().Trim(), Password = StreamingLiveLib.User.HashPassword(PasswordText.Text.Trim()), DisplayName="Admin" };
                u.ResetGuid = Guid.NewGuid().ToString();
                u.Save();

                StreamingLiveLib.Role r = new StreamingLiveLib.Role() { Name = "admin", SiteId = s.Id.Value, UserId = u.Id.Value };
                r.Save();

                System.IO.Directory.CreateDirectory(Server.MapPath("/data/" + s.KeyName));
                System.IO.File.Copy(Server.MapPath("/data/master/data.json"), Server.MapPath("/data/" + s.KeyName + "/data.json"));
                System.IO.File.Copy(Server.MapPath("/data/master/preview.json"), Server.MapPath("/data/" + s.KeyName + "/preview.json"));
                System.IO.File.Copy(Server.MapPath("/data/master/data.css"), Server.MapPath("/data/" + s.KeyName + "/data.css"));
                System.IO.File.Copy(Server.MapPath("/data/master/preview.css"), Server.MapPath("/data/" + s.KeyName + "/preview.css"));


                AppUser.Login(u);
                FormsAuthentication.SetAuthCookie(u.ResetGuid.ToString(), true);
                Response.Redirect("/cp/live/");
            }
            else OutputMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true, OutputLit);

        }

        private string[] Validate()
        {
            List<string> errors = new List<string>();
            if (KeyNameText.Text.Trim() == "") errors.Add("Domain name cannot be blank.");
            if (KeyNameText.Text.ToLower().Trim() == "www") errors.Add("Domain name not allowed.");
            if (KeyNameText.Text.ToLower().Trim() == "api") errors.Add("Domain name not allowed.");
            if (KeyNameText.Text.ToLower().Trim() == "admin") errors.Add("Domain name not allowed.");
            if (KeyNameText.Text.ToLower().Trim() == "master") errors.Add("Domain name not allowed.");

            if (!IsValidEmail(EmailText.Text)) errors.Add("Invalid email address.");
            if (PasswordText.Text.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");

            if (errors.Count == 0)
            {
                if (System.Text.RegularExpressions.Regex.Match(KeyNameText.Text, "[A-Za-z0-9\\-_]{1,99}").Value != KeyNameText.Text) errors.Add("Domain name can only contain letters, numbers and hyphens.");
            }
            if (errors.Count == 0)
            {
                if (StreamingLiveLib.Site.LoadByKeyName(KeyNameText.Text.ToLower().Trim()) != null) errors.Add("Sorry, this domain name is already taken.");
            }

            if (errors.Count == 0)
            {
                if (StreamingLiveLib.User.LoadByEmail(EmailText.Text) != null) errors.Add("There is already an account registered with this email address.  Log in instead.");
            }

            return errors.ToArray();
        }

        private void OutputMessage(string msg, bool error, Literal outputLit)
        {
            if (error) outputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">" + msg + "</div>";
            else outputLit.Text = "<div class=\"alert alert-success\" role=\"alert\">" + msg + "</div>";
        }

        bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}