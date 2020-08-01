using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Profile
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack) Populate();
        }


        private void Populate()
        {
            NameText.Text = AppUser.Current.UserData.DisplayName;
            EmailText.Text = AppUser.Current.UserData.Email;
        }

        protected void SaveButton_Click(object sender, EventArgs e)
        {
            string[] errors = Validate();
            if (errors.Length == 0)
            {
                AppUser.Current.UserData.DisplayName = NameText.Text;
                AppUser.Current.UserData.Email = EmailText.Text;
                if (PasswordText.Text != "") AppUser.Current.UserData.Password = StreamingLiveLib.User.HashPassword(PasswordText.Text);
                AppUser.Current.UserData.Save();
                OutputMessage("<b>Success:</b> Changes saved.", false, OutputLit);
            }
            else OutputMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true, OutputLit);

        }

        private void OutputMessage(string msg, bool error, Literal outputLit)
        {
            if (error) outputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">" + msg + "</div>";
            else outputLit.Text = "<div class=\"alert alert-success\" role=\"alert\">" + msg + "</div>";
        }

        private string[] Validate()
        {
            List<string> errors = new List<string>();
            if (NameText.Text.Trim() == "") errors.Add("Name cannot be blank");
            if (System.Text.RegularExpressions.Regex.Match(NameText.Text, "[A-Za-z0-9\\-_ \\.\\']{1,99}").Value != NameText.Text) errors.Add("Invalid characters in name.");
            if (!IsValidEmail(EmailText.Text)) errors.Add("Invalid email address.");
            if (PasswordText.Text != "" && PasswordText.Text.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");
            if (PasswordText.Text != PasswordConfirm.Text) errors.Add("Passwords do not match.");
            if (errors.Count == 0)
            {
                StreamingLiveLib.User existing = StreamingLiveLib.User.LoadByEmail(EmailText.Text);
                if (existing != null && existing.Id != AppUser.Current.UserData.Id) errors.Add("There is already an account registered with this email address.");
            }
            return errors.ToArray();
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