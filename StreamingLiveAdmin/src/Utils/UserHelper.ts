import { UserInterface, ChurchInterface, SettingInterface } from './ApiHelper'

export class UserHelper {
    static currentChurch: ChurchInterface;
    static churches: ChurchInterface[];
    static user: UserInterface;
    static currentSettings: SettingInterface;
}

