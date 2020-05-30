using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Hosting.Internal;
using System.IO;
using System.Security.Policy;
using System.Web;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Amazon.S3;

namespace StreamingLiveCore.Pages
{
    public class IndexModel : PageModel
    {
        
        public string Title = "Hello World";
        IAmazonS3 S3Client { get; set; }

        [Required]
        [BindProperty]
        public string KeyName { get; set; }
        
        [Required]
        [BindProperty]
        public string Email { get; set; }

        [Required]
        [BindProperty]
        public string Password { get; set; }

        public IndexModel(IAmazonS3 s3Client)
        {
            this.S3Client = s3Client;
        }


        public void OnGet()
        {
            int a = 0;
        }

        public void OnPost()
        {
            int a = 0;
        }


        public IActionResult OnPostRegister()
        {
            if (ModelState.IsValid)
            {
                string webRoot = CachedData.Environment.WebRootPath;

                StreamingLiveLib.Site s = new StreamingLiveLib.Site() { KeyName = KeyName.ToLower().Trim(), PrimaryColor = "#24b9ff", ContrastColor = "#ffffff", HeaderColor = "#24b9ff", HomePageUrl = "/", LogoUrl = "/data/master/logo.png", RegistrationDate = DateTime.UtcNow };
                s.Save();

                StreamingLiveLib.User u = new StreamingLiveLib.User() { Email = Email.ToLower().Trim(), Password = StreamingLiveLib.User.HashPassword(Password.Trim()), DisplayName = "Admin" };
                u.ResetGuid = Guid.NewGuid().ToString();
                u.Save();

                StreamingLiveLib.Role r = new StreamingLiveLib.Role() { Name = "admin", SiteId = s.Id, UserId = u.Id };
                r.Save();


                new StreamingLiveLib.Button() { SiteId = s.Id, Sort = 1, Text = "Resources", Url = "about:blank" }.Save();
                new StreamingLiveLib.Button() { SiteId = s.Id, Sort = 2, Text = "Give", Url = "about:blank" }.Save();

                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 1, TabType = "chat", TabData = "", Icon = "far fa-comment", Text = "Chat", Url = "" }.Save();
                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 2, TabType = "url", TabData = "", Icon = "fas fa-bible", Text = "Bible", Url = "https://www.bible.com/en-GB/bible/111/GEN.1.NIV" }.Save();
                new StreamingLiveLib.Tab() { SiteId = s.Id, Sort = 3, TabType = "prayer", TabData = "", Icon = "fas fa-praying-hands", Text = "Prayer", Url = "" }.Save();

                DateTime serviceTime = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 9 + 5, 0, 0).AddDays(1);
                while (serviceTime.DayOfWeek != DayOfWeek.Sunday) serviceTime = serviceTime.AddDays(1);
                new StreamingLiveLib.Service() { SiteId = s.Id, ChatAfter = 15 * 60, ChatBefore = 15 * 60, Duration = 60 * 60, EarlyStart = 5 * 60, Provider = "youtube_watchparty", ProviderKey = "zFOfmAHFKNw", VideoUrl = "https://www.youtube.com/embed/zFOfmAHFKNw?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1", ServiceTime = serviceTime, TimezoneOffset = 300, Recurring = false }.Save();


                Utils.CopyS3(S3Client, "data/master/data.json", $"data/{s.KeyName}/data.json");
                Utils.CopyS3(S3Client, "data/master/data.css", $"data/{s.KeyName}/data.css");

                try
                {
                    string body = "<a href=\"https://" + s.KeyName + ".streaminglive.church/\">https://" + s.KeyName + ".streaminglive.church/</a> - " + u.Email;
                    //StreamingLiveLib.Aws.EmailHelper.SendEmail(CachedData.SupportEmail, CachedData.SupportEmail, "New StreamingLive.church Registration", body);
                }
                catch { }



                AppUser.Login(u);

                var claims = new[] { new Claim(ClaimTypes.Name, u.ResetGuid), new Claim(ClaimTypes.Role, "User") };
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
                return Redirect("/cp/");
            }
            else return Page();
            
        }




    }
}