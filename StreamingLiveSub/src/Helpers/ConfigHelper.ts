import { ServicesHelper } from './'
import { EnvironmentHelper } from './';
export interface ColorsInterface { primary: string, contrast: string, header: string }
export interface LogoInterface { url: string, image: string }
export interface ButtonInterface { text: string, url: string }
export interface TabInterface { text: string, url: string, icon: string, type: string, data: string, updated?: boolean }
export interface ServiceInterface { videoUrl: string, serviceTime: string, duration: string, earlyStart: string, chatBefore: string, chatAfter: string, provider: string, providerKey: string, localCountdownTime?: Date, localStartTime?: Date, localEndTime?: Date, localChatStart?: Date, localChatEnd?: Date }
export interface ConfigurationInterface { keyName: string, color: ColorsInterface, logo: LogoInterface, buttons: ButtonInterface[], tabs: TabInterface[], services: ServiceInterface[] }


export class ConfigHelper {
    static current: ConfigurationInterface;

    static async load(keyName: string) {
        var jsonUrl = EnvironmentHelper.ContentRoot + keyName + '/data.json?nocache=' + (new Date()).getTime();
        if (await ConfigHelper.getQs('preview') === '1') jsonUrl = EnvironmentHelper.AdminUrl + '/preview/data?key=' + keyName + '&nocache=' + (new Date()).getTime();
        var result: ConfigurationInterface = await fetch(jsonUrl).then(response => response.json());
        ServicesHelper.updateServiceTimes(result);
        result.keyName = keyName;
        ConfigHelper.current = result;
        return result;
    }

    static async getQs(name: string) {
        var regex = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')
        var match = regex.exec(window.location.search);
        if (match) return decodeURIComponent(match[1]);
        else return null;
    }

    static setTabUpdated(tabType: string) {
        for (let i = 0; i < ConfigHelper.current.tabs.length; i++) {
            var t = ConfigHelper.current.tabs[i];
            if (t.type === tabType) t.updated = true;
        }
    }


}

