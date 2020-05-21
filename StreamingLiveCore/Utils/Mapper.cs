using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamingLiveCore.Utils
{
    public static class Mapper
    {
        //not used.  Just keeping for reference
        public static StreamingLiveLib.User Map(this StreamingLiveCore.Pages.IndexModel model)
        {
            StreamingLiveLib.User result = new StreamingLiveLib.User()
            {
                Email = model.Email,
                Password = model.Password,
            };
            return result;
        }
    }
}
