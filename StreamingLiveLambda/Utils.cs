using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace StreamingLiveLambda
{
    public class Utils
    {
        //Really wish there was a better option than manually including this list...
        internal static string BadWordList = @"\b(anal|ass|asses|ballsack|boner|clit|clitoris|cum|cunt|cunts|dicks|fag|fags|homo|homos|jiz|tit|twat|wang)\b|\b(cock)|asshole|bastard|bitch|biatch|blowjob|boob|bollock|bollok|butthole|dickhead|damn|dildo|duche|dyke|ejaculate|faggot|fellatio|fuck|masterbat|nigger|nigga|nutsack|orgasm|pecker|penis|pimp|piss|pussy|pussies|schlong|screw|shit|slut|testicle|tits|titt|viagra|vulva|wanker|whore";
        internal static Regex BadWords = new Regex(BadWordList, RegexOptions.IgnoreCase);

        public static string ReplaceBadWords(string input)
        {
            return BadWords.Replace(input, "****");
        }
    }
}
