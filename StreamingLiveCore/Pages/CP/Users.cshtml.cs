using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using StreamingLiveLib;

namespace StreamingLiveCore.Pages.CP
{
    public class UsersModel : PageModel
    {
        public Users Users { get; set; }
        public string OutputMessage { get; set; }
        public bool ShowEdit { get; set; }
        
        [BindProperty]
        public string SelectedRole { get; set; }
        [BindProperty]
        public int Id { get; set; }
        [BindProperty]
        public string Email { get; set; }
        [BindProperty]
        public string DisplayName { get; set; }
        [BindProperty]
        public string Password { get; set; }






        public void OnGet()
        {
            if (AppUser.Current.Role.Name != "admin") Response.Redirect("/cp/");
            Populate();
        }

        private void Populate()
        {
            LoadUsers();
            ShowEdit = false;
        }

        public void OnGetAdd()
        {
            LoadUsers();
            ShowEditUser(0);
        }

        public void OnGetEdit()
        {
            LoadUsers();
            int userId = Convert.ToInt32(Request.Query["id"]);
            ShowEditUser(userId);
        }

        public void OnPostDelete()
        {
            StreamingLiveLib.Role r = StreamingLiveLib.Role.Load(Id, AppUser.Current.Site.Id);
            StreamingLiveLib.Role.Delete(r.Id);

            if (StreamingLiveLib.Roles.LoadByUserId(Id).Count == 0) StreamingLiveLib.User.Delete(Id);
            Response.Redirect("/cp/users/");
            LoadUsers(); //*** It appears response.redirect doesn't end the page execution, which throws an error.  What's the right way to handle this?
        }

        public void OnPostSave()
        {
            string[] errors = Validate(Id);
            if (errors.Length == 0)
            {
                if (Id == 0)
                {
                    StreamingLiveLib.User existing = StreamingLiveLib.User.LoadByEmail(Email);
                    if (existing == null)
                    {
                        StreamingLiveLib.User user = new StreamingLiveLib.User();
                        user.DisplayName = DisplayName;
                        user.Email = Email;
                        user.Password = StreamingLiveLib.User.HashPassword(Password);
                        user.Save();
                        Id = user.Id;
                    }
                    else Id = existing.Id;
                    new StreamingLiveLib.Role() { SiteId = AppUser.Current.Site.Id, Name = SelectedRole, UserId = Id }.Save();
                }
                else
                {
                    StreamingLiveLib.Role role = StreamingLiveLib.Role.Load(Id, AppUser.Current.Site.Id);
                    role.Name = SelectedRole;
                    role.Save();
                }

                Populate();
                OutputMessage = Utils.FormatMessage("<b>Success:</b> Changes saved.", false);
            }
            else OutputMessage = Utils.FormatMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true);
        }

        private void LoadUsers()
        {
            Users = StreamingLiveLib.Users.LoadBySiteId(AppUser.Current.Site.Id);
        }



        private void ShowEditUser(int userId)
        {
            StreamingLiveLib.User selectedUser = (userId == 0) ? new StreamingLiveLib.User() : StreamingLiveLib.User.Load(userId);
            StreamingLiveLib.Role selectedRole = StreamingLiveLib.Role.Load(userId, AppUser.Current.Site.Id);

            Id = selectedUser.Id;
            Email = selectedUser.Email;
            DisplayName = selectedUser.DisplayName;
            Password = selectedUser.Password;

            SelectedRole = (selectedRole == null) ? "" : selectedRole.Name;
            ShowEdit = true;
        }

        private string[] Validate(int userId)
        {
            List<string> errors = new List<string>();
            if (userId == 0)
            {
                if (DisplayName.Trim() == "") errors.Add("Name cannot be blank");
                if (System.Text.RegularExpressions.Regex.Match(DisplayName, "[A-Za-z0-9\\-_ \\.\\']{1,99}").Value != DisplayName) errors.Add("Invalid characters in name.");
                if (!IsValidEmail(Email)) errors.Add("Invalid email address.");
                if (userId == 0 && Password == "") errors.Add("Password cannot be blank");
                if (Password != "" && Password.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");
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