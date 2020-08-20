import { inject } from "inversify";
import { controller, httpPost, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import { Setting } from "../models";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'

@controller("/settings")
export class SettingController extends BaseHttpController {
    private repositories: Repositories;
    private _logger: WinstonLogger;

    constructor(@inject(TYPES.Repositories) repositories: Repositories, @inject(TYPES.LoggerService) logger: WinstonLogger) {
        super()
        this.repositories = repositories;
        this._logger = logger;
    }

    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<void> {
        // const page = req.body.page;

        return null;
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Setting[]>, res: express.Response): Promise<any> {
        try {
            const au: AuthenticatedUser = new AuthenticatedUser(this.httpContext.user);
            if (!au.checkAccess('Settings', 'Edit')) return this.json({}, 401);
            else {
                let settings: Setting[] = req.body;
                const promises: Promise<Setting>[] = [];
                settings.forEach((setting) => { if (setting.churchId === au.churchId) promises.push(this.repositories.setting.save(setting)); });
                settings = await Promise.all(promises);
                return this.json(settings, 200);
            }
        } catch (e) {
            this._logger.logger.error(e);
            return this.internalServerError(e);
        }
    }

}
