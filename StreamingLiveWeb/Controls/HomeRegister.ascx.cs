using StreamingLiveLib;
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
                StreamingLiveLib.Site s = new StreamingLiveLib.Site() { KeyName = KeyNameText.Text.ToLower().Trim(), PrimaryColor="#24b9ff", ContrastColor="#ffffff", HeaderColor= "#24b9ff", HomePageUrl="/", LogoUrl= "/data/master/logo.png" };
                s.Save();

                StreamingLiveLib.User u = new StreamingLiveLib.User() { Email = EmailText.Text.ToLower().Trim(), Password = StreamingLiveLib.User.HashPassword(PasswordText.Text.Trim()), DisplayName="Admin" };
                u.ResetGuid = Guid.NewGuid().ToString();
                u.Save();

                StreamingLiveLib.Role r = new StreamingLiveLib.Role() { Name = "admin", SiteId = s.Id, UserId = u.Id.Value };
                r.Save();


                new StreamingLiveLib.Button() { SiteId = s.Id, Sort = 1, Text = "Resources", Url = "about:blank" }.Save();
                new StreamingLiveLib.Button() { SiteId = s.Id, Sort = 2, Text = "Give", Url="about:blank" }.Save();

                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 1, TabType="chat", TabData="", Icon= "far fa-comment", Text = "Chat", Url = "" }.Save();
                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 2, TabType = "url", TabData = "", Icon = "fas fa-bible", Text = "Bible", Url = "https://www.bible.com/en-GB/bible/111/GEN.1.NIV" }.Save();
                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 3, TabType = "prayer", TabData = "", Icon = "fas fa-praying-hands", Text = "Prayer", Url = "" }.Save();

                DateTime serviceTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 9+5, 0, 0).AddDays(1);
                while (serviceTime.DayOfWeek != DayOfWeek.Sunday) serviceTime = serviceTime.AddDays(1);
                new StreamingLiveLib.Service() { SiteId = s.Id, ChatAfter = 15 * 60, ChatBefore = 15 * 60, Duration = 60 * 60, EarlyStart = 5 * 60, Provider = "youtube_watchparty", ProviderKey = "zFOfmAHFKNw", VideoUrl = "https://www.youtube.com/embed/zFOfmAHFKNw?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1", ServiceTime = serviceTime, TimezoneOffset=300, Recurring=false }.Save();

                System.IO.Directory.CreateDirectory(Server.MapPath("/data/" + s.KeyName));
                System.IO.File.Copy(Server.MapPath("/data/master/data.json"), Server.MapPath("/data/" + s.KeyName + "/data.json"));
                System.IO.File.Copy(Server.MapPath("/data/master/data.css"), Server.MapPath("/data/" + s.KeyName + "/data.css"));

                try
                {
                    string body = "<a href=\"https://" + s.KeyName + ".streaminglive.church/\">https://" + s.KeyName + ".streaminglive.church/</a> - " + u.Email;
                    StreamingLiveLib.Aws.EmailHelper.SendEmail(CachedData.SupportEmail, CachedData.SupportEmail, "New StreamingLive.church Registration", body);
                } catch { }



                AppUser.Login(u);
                FormsAuthentication.SetAuthCookie(u.ResetGuid.ToString(), true);
                Response.Redirect("/cp/welcome.aspx");
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

            if (!IsValidEmail(EmailText.Text.Trim())) errors.Add("Invalid email address.");
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