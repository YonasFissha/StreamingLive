import { controller, httpPost, httpGet, requestParam } from "inversify-express-utils";
import { Setting, } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";
import { AwsHelper } from "../helpers";
import { SettingsHelper } from "../helpers";

@controller("/settings")
export class SettingController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.setting.loadAll(au.churchId);
        });
    }

    @httpGet("/checkAvailable/:key")
    public async checkAvailable(@requestParam("key") key: string, req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
        try {
            const settings: Setting = await this.repositories.setting.loadByKey(key);
            const data = { available: settings === null };
            return this.json(data, 200);
        } catch (e) {
            this.logger.logger.error(e);
            return this.internalServerError(e);
        }
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
        const key = "data/" + setting.keyName + "/logo.png";
        await AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64'))
    }

    @httpPost("/publish")
    public async publish(req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            SettingsHelper.publish(au.churchId, this.repositories);

            return this.json([], 200);
        });
    }



    /*
    @httpGet("/tmpPublish/:key")
    public async tmpPublish(@requestParam("key") key: string, req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
        try {
            const settings: Setting = await this.repositories.setting.loadByKey(key);
            let tabs: Tab[] = null;
            let links: Link[] = null;
            let services: Service[] = null;

            let promises: Promise<any>[] = [];
            promises.push(this.repositories.tab.loadAll(settings.churchId).then(d => tabs = d));
            promises.push(this.repositories.link.loadAll(settings.churchId).then(d => links = d));
            promises.push(this.repositories.service.loadAll(settings.churchId).then(d => services = d));
            await Promise.all(promises);

            promises = [];
            promises.push(this.publishData(settings, tabs, links, services));
            promises.push(this.publishCss(settings));
            await Promise.all(promises);

            return this.json([], 200);
        } catch (e) {
            this.logger.logger.error(e);
            return this.internalServerError(e);
        }
    }
*/

}
