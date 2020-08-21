import { inject } from "inversify";
import { controller, httpPost, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import { Setting } from "../models";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'


export class CustomBaseController extends BaseHttpController {

    public repositories: Repositories;
    public logger: WinstonLogger;

    constructor(@inject(TYPES.Repositories) repositories: Repositories, @inject(TYPES.LoggerService) logger: WinstonLogger) {
        super()
        this.repositories = repositories;
        this.logger = logger;

    }

    public au(): AuthenticatedUser {
        return new AuthenticatedUser(this.httpContext.user);
    }

    public async actionWrapper(req: express.Request, res: express.Response, fetchFunction: () => any): Promise<any> {
        try {
            return await fetchFunction();
        } catch (e) {
            this.logger.logger.error(e);
            return this.internalServerError(e);
        }
    }



}
