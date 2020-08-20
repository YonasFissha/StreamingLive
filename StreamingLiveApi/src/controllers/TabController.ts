import { inject } from "inversify";
import { controller, httpPost, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import { Tab } from "../models";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'

@controller("/tabs")
export class TabController extends BaseHttpController {
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
    public async save(req: express.Request<{}, {}, Tab[]>, res: express.Response): Promise<any> {
        try {
            const au: AuthenticatedUser = new AuthenticatedUser(this.httpContext.user);
            if (!au.checkAccess('Tabs', 'Edit')) return this.json({}, 401);
            else {
                let tabs: Tab[] = req.body;
                const promises: Promise<Tab>[] = [];
                tabs.forEach((tab) => { if (tab.churchId === au.churchId) promises.push(this.repositories.tab.save(tab)); });
                tabs = await Promise.all(promises);
                return this.json(tabs, 200);
            }
        } catch (e) {
            this._logger.logger.error(e);
            return this.internalServerError(e);
        }
    }

}
