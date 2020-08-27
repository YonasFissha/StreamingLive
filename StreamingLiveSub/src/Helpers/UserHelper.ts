import { UserInterface, ChurchInterface } from './ApiHelper'

export class UserHelper {
    static currentChurch: ChurchInterface;
    static churches: ChurchInterface[];
    static user: UserInterface;
    static isHost = false;
}

