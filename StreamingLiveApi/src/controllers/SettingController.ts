import { controller, httpPost, httpGet } from "inversify-express-utils";
import { Setting } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/settings")
export class SettingController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            return await this.repositories.setting.loadAll(this.au().churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Setting[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            if (!this.au().checkAccess('Settings', 'Edit')) return this.json({}, 401);
            else {
                let settings: Setting[] = req.body;
                const promises: Promise<Setting>[] = [];
                settings.forEach((setting) => { if (setting.churchId === this.au().churchId) promises.push(this.repositories.setting.save(setting)); });
                settings = await Promise.all(promises);
                return this.json(settings, 200);
            }
        });
    }

}
