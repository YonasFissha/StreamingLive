using NLog;
using NLog.AWS.Logger;
using NLog.Config;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace StreamingLiveLambda
{
    public class Logging
    {
        private static NLog.LogLevel logLevel = LogLevel.Info;
        private static bool configured = false;


        public static void LogDebug(string message)
        {
            if (logLevel >= LogLevel.Debug)
            {
                if (!configured) Configure();
                Logger logger = LogManager.GetCurrentClassLogger();
                logger.Debug(message);
            }
        }

        public static void LogInfo(string message)
        {
            if (logLevel >= LogLevel.Info)
            {
                if (!configured) Configure();
                Logger logger = LogManager.GetCurrentClassLogger();
                logger.Info(message);
            }
        }

        public static void LogException(Exception ex)
        {
            if (!configured) Configure();
            Logger logger = LogManager.GetCurrentClassLogger();
            logger.Error(ex);
        }

        public static void Init()
        {
            configured = false;
        }

        private static void Configure()
        {
            LoggingConfiguration config = new LoggingConfiguration();

            var awsTarget = new AWSTarget()
            {
                LogGroup = "StreamingLive.Lambda",
                Region = "us-east-2"
            };
            config.AddTarget("aws", awsTarget);
            config.LoggingRules.Add(new LoggingRule("*", logLevel, awsTarget));
            LogManager.Configuration = config;
            configured = true;
        }



    }
}
