import { controller, httpPost, httpGet } from "inversify-express-utils";
import { Service } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/services")
export class ServiceController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            return await this.repositories.service.loadAll(this.au().churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Service[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            if (!this.au().checkAccess('Services', 'Edit')) return this.json({}, 401);
            else {
                let services: Service[] = req.body;
                const promises: Promise<Service>[] = [];
                services.forEach((service) => { if (service.churchId === this.au().churchId) promises.push(this.repositories.service.save(service)); });
                services = await Promise.all(promises);
                return this.json(services, 200);
            }
        });
    }

}
