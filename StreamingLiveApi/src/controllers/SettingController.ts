import { controller, httpPost, httpGet } from "inversify-express-utils";
import { Setting, Tab, Link, Service } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";
import { AwsHelper } from "../helpers";

@controller("/settings")
export class SettingController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.setting.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Setting[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess('Settings', 'Edit')) return this.json({}, 401);
            else {
                let settings: Setting[] = req.body;
                const promises: Promise<Setting>[] = [];
                settings.forEach((setting) => {
                    if (setting.churchId === au.churchId) {
                        const promise = new Promise<Setting>(async (resolve, reject) => {
                            try {
                                if (setting.logoUrl.indexOf(',') > -1) {
                                    await this.saveLogo(setting);
                                    setting.logoUrl = "/data/" + setting.keyName + "/logo.png";
                                }
                                const s = await this.repositories.setting.save(setting);
                                resolve(s);
                            } catch (e) {
                                reject(e);
                            }
                        });
                        promises.push(promise);
                    }
                });
                settings = await Promise.all(promises);
                return this.json(settings, 200);
            }
        });
    }

    private async saveLogo(setting: Setting) {
        const base64 = setting.logoUrl.split(',')[1];
        const key = setting.keyName + "/logo.png";
        await AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64'))
    }


    @httpPost("/publish")
    public async publish(req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            let settings: Setting = null;
            let tabs: Tab[] = null;
            let links: Link[] = null;
            let services: Service[] = null;

            let promises: Promise<any>[] = [];
            promises.push(this.repositories.setting.loadAll(au.churchId).then(d => settings = d[0]));
            promises.push(this.repositories.tab.loadAll(au.churchId).then(d => tabs = d));
            promises.push(this.repositories.link.loadAll(au.churchId).then(d => links = d));
            promises.push(this.repositories.service.loadAll(au.churchId).then(d => services = d));
            await Promise.all(promises);

            promises = [];
            promises.push(this.publishData(settings, tabs, links, services));
            promises.push(this.publishCss(settings));
            await Promise.all(promises);

            return this.json([], 200);
        });
    }

    private publishData(settings: Setting, tabs: Tab[], links: Link[], services: Service[]): Promise<any> {
        const result: any = {};
        result.colors = { primary: settings.primaryColor, contrast: settings.contrastColor };
        result.logo = { url: settings.homePageUrl, image: settings.logoUrl };
        result.buttons = [];
        result.tabs = [];
        result.services = [];

        tabs.forEach(t => {
            result.tabs.push({ text: t.text, url: t.url, type: t.tabType, data: t.tabData, icon: t.icon });
        });

        links.forEach(l => {
            result.buttons.push({ text: l.text, url: l.url });
        });

        services.forEach(s => {
            result.services.push({
                videoUrl: s.videoUrl,
                serviceTime: s.serviceTime,
                duration: this.formatTime(s.duration),
                earlyStart: this.formatTime(s.earlyStart),
                chatBefore: this.formatTime(s.chatBefore),
                chatAfter: this.formatTime(s.chatAfter),
                provider: s.provider,
                providerKey: s.providerKey
            });
        });
        const path = settings.keyName + '/data.json';
        const buffer = Buffer.from(JSON.stringify(result), 'utf8');
        return AwsHelper.S3Upload(path, "application/json", buffer)
    }


    private publishCss(settings: Setting): Promise<any> {
        const result = ":root { --primaryColor: " + settings.primaryColor + "; --contrastColor: " + settings.contrastColor + "; --headerColor: " + settings.primaryColor + " }"
        const path = settings.keyName + '/data.css';
        const buffer = Buffer.from(result, 'utf8');
        return AwsHelper.S3Upload(path, "text/css", buffer)
    }

    private formatTime(seconds: number) {
        const min = Math.floor(seconds / 60);
        const sec = seconds - (min * 60);
        return min.toString() + ":" + sec.toString().padStart(2, "0");
    }

}
