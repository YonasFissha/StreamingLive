import { inject } from "inversify";
import { controller, httpPost, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import { Link, Service } from "../models";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'

@controller("/services")
export class ServiceController extends BaseHttpController {
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
    public async save(req: express.Request<{}, {}, Service[]>, res: express.Response): Promise<any> {
        try {
            const au: AuthenticatedUser = new AuthenticatedUser(this.httpContext.user);
            if (!au.checkAccess('Services', 'Edit')) return this.json({}, 401);
            else {
                let services: Service[] = req.body;
                const promises: Promise<Service>[] = [];
                services.forEach((service) => { if (service.churchId === au.churchId) promises.push(this.repositories.service.save(service)); });
                services = await Promise.all(promises);
                return this.json(services, 200);
            }
        } catch (e) {
            this._logger.logger.error(e);
            return this.internalServerError(e);
        }
    }

}
