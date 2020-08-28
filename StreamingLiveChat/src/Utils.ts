export class Utils {
    static replaceBadWords = (message: string) => {
        // I wish there was a better way than having to list all of these.
        const badWords = /\b(anal|ass|asses|ballsack|boner|clit|clitoris|cum|cunt|cunts|dicks|fag|fags|homo|homos|jiz|tit|twat|wang)\b|\b(cock|sex)|asshole|bastard|bitch|biatch|blowjob|boob|bollock|bollok|butthole|dickhead|damn|dildo|duche|dyke|ejaculate|faggot|fellatio|fuck|masterbat|nigger|nigga|nutsack|orgasm|pecker|penis|pimp|piss|pussy|pussies|schlong|screw|shit|slut|testicle|tits|titt|viagra|vulva|wanker|whore/gi;
        return message.replace(badWords, '****');
    }
}