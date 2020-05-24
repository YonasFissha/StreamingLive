using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace StreamingLiveCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages(options => {
                options.Conventions.AuthorizeFolder("/CP");
                options.Conventions.AllowAnonymousToPage("/CP/login");
                options.Conventions.AllowAnonymousToPage("/CP/logout");
            });
            services.AddServerSideBlazor();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o => o.LoginPath = new PathString("/cp/login"));
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();
            services.AddSession();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            SetCachedData(env);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSession();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            AppContext.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapBlazorHub();
            });
        }


        private void SetCachedData(IWebHostEnvironment env)
        {
            CachedData.Environment = env;
            CachedData.SupportEmail = Configuration["AppSettings:SupportEmail"];
            CachedData.DataFolder = Configuration["AppSettings:DataFolder"];
            StreamingLiveLib.CachedData.PasswordSalt = Configuration["AppSettings:PasswordSalt"];
            StreamingLiveLib.CachedData.ConnectionString = Configuration["AppSettings:ConnectionString"];
            StreamingLiveLib.CachedData.SesKey = Configuration["AppSettings:SesKey"];
            StreamingLiveLib.CachedData.SesSecret = Configuration["AppSettings:SesSecret"];
            StreamingLiveLib.CachedData.AnalyticsCredentialFile = Configuration["AppSettings:AnalyticsCredentialFile"];
            StreamingLiveLib.CachedData.AnalyticsViewId = Configuration["AppSettings:AnalyticsViewId"];

        }

    }
}
