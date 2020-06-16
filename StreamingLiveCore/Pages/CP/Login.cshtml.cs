using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

namespace StreamingLiveCore.Pages.CP
{
    public class LoginModel : PageModel
    {

        [Required]
        [BindProperty]
        public string Email { get; set; }

        [Required]
        [BindProperty]
        public string Password { get; set; }

        [BindProperty]
        public string ErrorMessage { get; set; }

        [BindProperty]
        public string ReturnUrl { get; set; }



        public void OnGet()
        {
            ReturnUrl = Request.Query["ReturnUrl"];
        }


        public IActionResult OnPostSignIn()
        {
            if (ModelState.IsValid)
            {
                StreamingLiveLib.User user = StreamingLiveLib.User.Login(Email, Password);

                if (user == null)
                {
                    ErrorMessage = "<div class=\"alert alert-warning\" role=\"alert\">Invalid email address / password combination.</div>";
                }
                else
                {
                    user.ResetGuid = Guid.NewGuid().ToString();
                    user.Save();
                    AppUser.Login(user);
                    
                    var claims = new[] { new Claim(ClaimTypes.Name, user.ResetGuid), new Claim(ClaimTypes.Role, "User") };
                    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

                    AppUser.CurrentSite = AppUser.Current.Sites[0];

                    //***This doesn't seem like the right way to get the return url;
                    if (ReturnUrl == null || ReturnUrl == "") ReturnUrl = "/cp/";
                    return Redirect(ReturnUrl);
                }
            }
            return this.Page();

        }

    }
}