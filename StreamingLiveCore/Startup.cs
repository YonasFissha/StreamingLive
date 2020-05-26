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
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.Util;
using StreamingLiveLib;
using Amazon.DynamoDBv2;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.AspNetCore.DataProtection;
using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;

namespace StreamingLiveCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration, Microsoft.AspNetCore.Hosting.IWebHostEnvironment environment)
        {
            Configuration = configuration;
            CachedData.Environment = environment;
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

            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));


            AWSOptions awsOptions = Configuration.GetAWSOptions();
            //IAmazonS3 client = awsOptions.CreateServiceClient<IAmazonS3>();

            if (CachedData.Environment.EnvironmentName == "Production")
            {
                //Store Session in DynamoDB
                services.AddDefaultAWSOptions(awsOptions);
                services.AddAWSService<IAmazonDynamoDB>();
                services.AddSingleton<IXmlRepository, Session.DdbXmlRepository>();
                services.AddDistributedDynamoDbCache(o => {
                    o.TableName = "StreamingLiveSessionState";
                    o.IdleTimeout = TimeSpan.FromMinutes(30);
                });
                services.AddSession(o => { o.IdleTimeout = TimeSpan.FromMinutes(30); o.Cookie.HttpOnly = false; });
                var sp = services.BuildServiceProvider(); //***Not sure this is the proper way to access this
                services.AddDataProtection().AddKeyManagementOptions(o => o.XmlRepository = sp.GetService<IXmlRepository>());
                

                //Log errors to Cloudwatch
                services.AddLogging(factory =>
                {
                    var loggerOptions = new LambdaLoggerOptions();
                    loggerOptions.IncludeCategory = false;
                    loggerOptions.IncludeLogLevel = false;
                    loggerOptions.IncludeNewline = true;
                    loggerOptions.IncludeException = true;
                    loggerOptions.IncludeEventId = true;
                    loggerOptions.IncludeScopes = true;

                    loggerOptions.Filter = (category, logLevel) =>
                    {
                        if (string.Equals(category, "Default", StringComparison.Ordinal)) return (logLevel >= LogLevel.Debug);
                        if (string.Equals(category, "Microsoft", StringComparison.Ordinal)) return (logLevel >= LogLevel.Information);
                        return true;
                    };

                    factory.AddLambdaLogger(loggerOptions);
                });
            }
            services.AddAWSService<IAmazonS3>();





        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            SetCachedData(env);

            //app.UseDeveloperExceptionPage();
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
            app.UseCors("CorsPolicy");



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
            CachedData.S3ContentBucket = Configuration["AppSettings:S3ContentBucket"];
            CachedData.ContentUrl = $"https://{CachedData.S3ContentBucket}.s3.us-east-2.amazonaws.com";

            StreamingLiveLib.CachedData.PasswordSalt = Configuration["AppSettings:PasswordSalt"];
            StreamingLiveLib.CachedData.ConnectionString = Configuration["AppSettings:ConnectionString"];
            StreamingLiveLib.CachedData.SesKey = Configuration["AppSettings:SesKey"];
            StreamingLiveLib.CachedData.SesSecret = Configuration["AppSettings:SesSecret"];
            StreamingLiveLib.CachedData.AnalyticsCredentialFile = Configuration["AppSettings:AnalyticsCredentialFile"];
            StreamingLiveLib.CachedData.AnalyticsViewId = Configuration["AppSettings:AnalyticsViewId"];

        }

    }
}
