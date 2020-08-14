
export class Service {
    id: number;
    churchId: number;
    serviceTime: Date;
    earlyStart: number;
    duration: number;
    chatBefore: number;
    chatAfter: number;
    provider: string;
    proivderKey: string;
    videoUrl: string;
    timezoneOffset: number;
    recurring: boolean;
}