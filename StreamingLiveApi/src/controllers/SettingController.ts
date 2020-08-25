import { controller, httpPost, httpGet } from "inversify-express-utils";
import { Setting } from "../models";
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
        const key = "data/" + setting.keyName + "/logo.png";
        await AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64'))
    }

}
