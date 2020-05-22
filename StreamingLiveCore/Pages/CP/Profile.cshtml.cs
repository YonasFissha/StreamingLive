using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

namespace StreamingLiveCore.Pages.CP
{
    public class ProfileModel : PageModel
    {
        [Required]
        [BindProperty]
        public string Name { get; set; }

        [Required]
        [BindProperty]
        public string Email { get; set; }

        [BindProperty]
        public string Password { get; set; }

        [BindProperty]
        public string ConfirmPassword { get; set; }

        public string OutputMessage { get; set; }

        public void OnGet()
        {
            Name = AppUser.Current.UserData.DisplayName;
            Email = AppUser.Current.UserData.Email;
        }

        public void OnPostSave()
        {
            string[] errors = Validate();
            if (errors.Length == 0)
            {
                AppUser.Current.UserData.DisplayName = Name;
                AppUser.Current.UserData.Email = Email;
                if (Password != "") AppUser.Current.UserData.Password = StreamingLiveLib.User.HashPassword(Password);
                AppUser.Current.UserData.Save();
                OutputMessage = Utils.FormatMessage("<b>Success:</b> Changes saved.", false);
            }
            else OutputMessage = Utils.FormatMessage("<b>Error:</b><ul><li>" + String.Join("</li><li>", errors) + "</li></ul>", true);

        }

        private string[] Validate()
        {
            List<string> errors = new List<string>();

            if (Name == null) Name = "";
            if (Email == null) Email = "";
            if (Password == null) Password = "";
            if (ConfirmPassword == null) ConfirmPassword = "";

            if (Name.Trim() == "") errors.Add("Name cannot be blank");
            if (System.Text.RegularExpressions.Regex.Match(Name, "[A-Za-z0-9\\-_ \\.\\']{1,99}").Value != Name) errors.Add("Invalid characters in name.");
            if (!IsValidEmail(Email)) errors.Add("Invalid email address.");
            if (Password!=null && Password != "" && Password.Trim().Length < 6) errors.Add("Password must be at least 6 characters.");
            if (Password != ConfirmPassword) errors.Add("Passwords do not match.");
            if (errors.Count == 0)
            {
                StreamingLiveLib.User existing = StreamingLiveLib.User.LoadByEmail(Email);
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
