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
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            if (!IsPostBack)
            {
                Populate();
                ShowEditUser(AppUser.Current.UserData.Id.Value);
            }
        }

        private void Populate()
        {
            UserRepeater.DataSource = StreamingLiveLib.Users.LoadBySiteId(AppUser.Current.Site.Id.Value);
            UserRepeater.DataBind();
            EditHolder.Visible = false;
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
                if (userId == 0)
                {
                    StreamingLiveLib.User existing = StreamingLiveLib.User.LoadByEmail(EmailText.Text);
                    if (existing == null)
                    {
                        StreamingLiveLib.User user = new StreamingLiveLib.User();
                        user.DisplayName = NameText.Text;
                        user.Email = EmailText.Text;
                        user.Password = StreamingLiveLib.User.HashPassword(PasswordText.Text);
                        user.Save();
                        userId = user.Id.Value;
                    }
                    else userId = existing.Id.Value;
                    new StreamingLiveLib.Role() { SiteId = AppUser.Current.Site.Id.Value, Name = RoleList.SelectedValue, UserId = userId }.Save();
                } else if (RoleList.Enabled)
                {
                    StreamingLiveLib.Role role = StreamingLiveLib.Role.Load(userId, AppUser.Current.Site.Id.Value);
                    role.Name = RoleList.SelectedValue;
                    role.Save();
                }

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
            if (userId == 0)
            {
                if (NameText.Text.Trim() == "") errors.Add("Name cannot be blank");
                if (System.Text.RegularExpressions.Regex.Match(NameText.Text, "[A-Za-z0-9\\-_ \\.\\']{1,99}").Value != NameText.Text) errors.Add("Invalid characters in name.");
                if (!IsValidEmail(EmailText.Text)) errors.Add("Invalid email address.");
                if (userId == 0 && PasswordText.Text == "") errors.Add("Password cannot be blank");
                if (PasswordText.Text != "" && PasswordText.Text.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");
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
            StreamingLiveLib.Role r = StreamingLiveLib.Role.Load(userId, AppUser.Current.Site.Id.Value);
            StreamingLiveLib.Role.Delete(r.Id.Value);

            if (StreamingLiveLib.Roles.LoadByUserId(userId).Count==0) StreamingLiveLib.User.Delete(userId);
            Response.Redirect("/cp/users/");
        }


        private void ShowEditUser(int userId)
        {
            EditHolder.Visible = true;
            StreamingLiveLib.User user = (userId == 0) ? new StreamingLiveLib.User() : StreamingLiveLib.User.Load(userId);

            NameLit.Visible = false;
            NameText.Visible = false;
            EmailLit.Visible = false;
            EmailText.Visible = false;

            if (userId==0)
            {
                PasswordHolder.Visible = true;
                NameText.Visible = true;
                EmailText.Visible = true;
            } else
            {
                PasswordHolder.Visible = false;
                NameLit.Visible = true;
                EmailLit.Visible = true;
                NameLit.Text = "<div>" + user.DisplayName + "</div>";
                EmailLit.Text = "<div>" + user.Email + "</div>";
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