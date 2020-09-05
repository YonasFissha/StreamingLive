import { Repositories } from "../repositories";
import { Setting, Tab, Link, Service } from "../models";
import { ConfigHelper, AwsHelper } from "./"

export class SettingsHelper {

    public static async publish(churchId: number, repositories: Repositories) {
        let settings: Setting = null;
        let tabs: Tab[] = null;
        let links: Link[] = null;
        let services: Service[] = null;

        let promises: Promise<any>[] = [];
        promises.push(repositories.setting.loadAll(churchId).then(d => settings = d[0]));
        promises.push(repositories.tab.loadAll(churchId).then(d => tabs = d));
        promises.push(repositories.link.loadAll(churchId).then(d => links = d));
        promises.push(repositories.service.loadAll(churchId).then(d => services = d));
        await Promise.all(promises);

        promises = [];
        promises.push(this.publishData(settings, tabs, links, services));
        promises.push(this.publishCss(settings));
        await Promise.all(promises);

    }


    private static publishData(settings: Setting, tabs: Tab[], links: Link[], services: Service[]): Promise<any> {
        const result = ConfigHelper.generateJson(settings, tabs, links, services);
        const path = "data/" + settings.keyName + '/data.json';
        const buffer = Buffer.from(JSON.stringify(result), 'utf8');
        return AwsHelper.S3Upload(path, "application/json", buffer)
    }


    private static publishCss(settings: Setting): Promise<any> {
        const result = ConfigHelper.generateCss(settings);
        const path = "data/" + settings.keyName + '/data.css';
        const buffer = Buffer.from(result, 'utf8');
        return AwsHelper.S3Upload(path, "text/css", buffer)
    }


}