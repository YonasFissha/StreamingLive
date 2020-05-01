using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace StreamingLiveWeb
{
    public class AppUser
    {
        public StreamingLiveLib.User UserData;
        public StreamingLiveLib.Sites Sites;
        public StreamingLiveLib.Site Site;
        public StreamingLiveLib.Role Role;

        public bool IsAuthenticated
        {
            get { return UserData != null; }
        }

        public static AppUser Current
        {
            get
            {
                AppUser au = null;
                HttpContext context = HttpContext.Current;

                if (context.Session["AppUser"] != null) au = (AppUser)context.Session["AppUser"];
                else
                {
                    au = new AppUser();
                    if (context.User.Identity.IsAuthenticated)
                    {
                        string resetGuid = context.User.Identity.Name;
                        StreamingLiveLib.User u = StreamingLiveLib.User.LoadByResetGuid(resetGuid);
                        if (u != null) au = Login(u);
                        else context.Response.Redirect("/cp/logout.aspx");
                    }
                    else context.Response.Redirect("/cp/logout.aspx");
                    context.Session["AppUser"] = au;
                }
                return au;
            }
            set { HttpContext.Current.Session["AppUser"] = value; }
        }


        public static AppUser Login(StreamingLiveLib.User u)
        {
            StreamingLiveLib.Sites sites = StreamingLiveLib.Sites.LoadByUserId(u.Id.Value);
            if (sites.Count == 0) return null;
            StreamingLiveLib.Role role = StreamingLiveLib.Role.Load(u.Id.Value, sites[0].Id.Value);
            if (role == null) return null;


            AppUser user = new AppUser { UserData = u, Sites=sites, Site = sites[0], Role=role };
            AppUser.Current = user;
            return user;
        }

        public static void Logout()
        {
            AppUser.Current = null;
            FormsAuthentication.SignOut();
            HttpContext.Current.Response.Redirect("/");
        }


    }
}