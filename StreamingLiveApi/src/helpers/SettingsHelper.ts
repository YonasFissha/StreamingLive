import { Repositories } from "../repositories";
import { Setting, Tab, Link, Service } from "../models";
import { ConfigHelper, AwsHelper } from "./"
import { WinstonLogger } from "../logger";
import { SubDomainHelper } from "../helpers";

export class SettingsHelper {

    public static async publish(churchId: number, repositories: Repositories, logger: WinstonLogger) {
        let settings: Setting = null;
        let tabs: Tab[] = null;
        let links: Link[] = null;
        let services: Service[] = null;

        const subDomain = await SubDomainHelper.get(churchId);

        let promises: Promise<any>[] = [];
        promises.push(repositories.setting.loadAll(churchId).then(d => settings = d[0]));
        promises.push(repositories.tab.loadAll(churchId).then(d => tabs = d));
        promises.push(repositories.link.loadAll(churchId).then(d => links = d));
        promises.push(repositories.service.loadAll(churchId).then(d => services = d));
        await Promise.all(promises);

        promises = [];
        promises.push(this.publishData(subDomain, settings, tabs, links, services, logger));
        promises.push(this.publishCss(subDomain, settings));
        logger.info(JSON.stringify(promises));
        await Promise.all(promises);

    }


    private static publishData(subDomain: string, settings: Setting, tabs: Tab[], links: Link[], services: Service[], logger: WinstonLogger): Promise<any> {
        // console.log("publishing");
        const result = ConfigHelper.generateJson(settings, tabs, links, services);
        const path = "data/" + subDomain + '/data.json';
        const buffer = Buffer.from(JSON.stringify(result), 'utf8');
        return AwsHelper.S3Upload(path, "application/json", buffer)
    }


    private static publishCss(subDomain: string, settings: Setting): Promise<any> {
        const result = ConfigHelper.generateCss(settings);
        const path = "data/" + subDomain + '/data.css';
        const buffer = Buffer.from(result, 'utf8');
        return AwsHelper.S3Upload(path, "text/css", buffer)
    }


}