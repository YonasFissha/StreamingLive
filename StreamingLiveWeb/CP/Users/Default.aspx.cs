using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Users
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                Populate();
                ShowEditUser(AppUser.Current.UserData.Id.Value);
            }
        }

        private void Populate()
        {
            UserListHolder.Visible = AppUser.Current.Role.Name == "admin";
            if (UserListHolder.Visible)
            {
                UserRepeater.DataSource = StreamingLiveLib.Users.LoadBySiteId(AppUser.Current.Site.Id.Value);
                UserRepeater.DataBind();
            }
            
        }


        protected void UserRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            int userId = Convert.ToInt32(e.CommandArgument);
            ShowEditUser(userId);
        }

        protected void UserRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            StreamingLiveLib.User user = (StreamingLiveLib.User)e.Item.DataItem;
            LinkButton EditLink = (LinkButton)e.Item.FindControl("EditLink");
            EditLink.CommandArgument = user.Id.ToString();
        }

        protected void AddUserLink_Click(object sender, EventArgs e)
        {
            ShowEditUser(0);
        }

        protected void SaveButton_Click(object sender, EventArgs e)
        {
            int userId = Convert.ToInt32(UserIdHid.Value);
            string[] errors = Validate(userId);
            if (errors.Length == 0)
            {
                StreamingLiveLib.User user = (userId == 0) ? new StreamingLiveLib.User() : StreamingLiveLib.User.Load(userId);

                user.DisplayName = NameText.Text;
                user.Email = EmailText.Text;
                if (PasswordText.Text!="") user.Password = StreamingLiveLib.User.HashPassword(PasswordText.Text);

                user.Save();

                if (userId == 0) new StreamingLiveLib.Role() { SiteId = AppUser.Current.Site.Id.Value, Name = RoleList.SelectedValue, UserId = user.Id.Value }.Save();
                else if (RoleList.Enabled)
                {
                    StreamingLiveLib.Role role = StreamingLiveLib.Role.Load(user.Id.Value, AppUser.Current.Site.Id.Value);
                    role.Name = RoleList.SelectedValue;
                    role.Save();
                }

                if (user.Id == AppUser.Current.UserData.Id.Value) AppUser.Current.UserData.DisplayName = user.DisplayName;
                Populate();
                OutputMessage("<b>Success:</b> Changes saved.", false, OutputLit);
            }
            else OutputMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true, OutputLit);

        }

        private void OutputMessage(string msg, bool error, Literal outputLit)
        {
            if (error) outputLit.Text = "<div class=\"alert alert-warning\" role=\"alert\">" + msg + "</div>";
            else outputLit.Text = "<div class=\"alert alert-success\" role=\"alert\">" + msg + "</div>";
        }

        private string[] Validate(int userId)
        {
            List<string> errors = new List<string>();
            if (NameText.Text.Trim() == "") errors.Add("Name cannot be blank");
            if (System.Text.RegularExpressions.Regex.Match(NameText.Text, "[A-Za-z0-9\\-_ \\.\\']{1,99}").Value != NameText.Text) errors.Add("Invalid characters in name.");
            if (!IsValidEmail(EmailText.Text)) errors.Add("Invalid email address.");
            if (userId == 0 && PasswordText.Text == "") errors.Add("Password cannot be blank");
            if (PasswordText.Text!="" && PasswordText.Text.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");
            if (errors.Count == 0)
            {
                StreamingLiveLib.User existing = StreamingLiveLib.User.LoadByEmail(EmailText.Text);
                if (existing != null && existing.Id.Value!=userId) errors.Add("There is already an account registered with this email address.");
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


        protected void DeleteButton_Click(object sender, EventArgs e)
        {
            int userId = Convert.ToInt32(UserIdHid.Value);
            StreamingLiveLib.User.Delete(userId);
            StreamingLiveLib.Role r = StreamingLiveLib.Role.Load(userId, AppUser.Current.Site.Id.Value);
            StreamingLiveLib.Role.Delete(r.Id.Value);
            Response.Redirect("/cp/users/");
        }


        private void ShowEditUser(int userId)
        {
            StreamingLiveLib.User user = (userId == 0) ? new StreamingLiveLib.User() : StreamingLiveLib.User.Load(userId);
            NameText.Text = user.DisplayName;
            EmailText.Text = user.Email;
            if (userId>0)
            {
                StreamingLiveLib.Role role = StreamingLiveLib.Role.Load(userId, AppUser.Current.Site.Id.Value);
                RoleList.SelectedValue = role.Name;
            }

            DeleteHolder.Visible = (userId != 0 && userId != AppUser.Current.UserData.Id.Value);

            RoleList.Enabled = true;
            if (userId == AppUser.Current.UserData.Id.Value) RoleList.Enabled = false;
            UserIdHid.Value = userId.ToString();
            

        }

    }
}