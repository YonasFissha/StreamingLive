import { controller, httpPost, httpGet, httpDelete, requestParam } from "inversify-express-utils";
import { Service } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/services")
export class ServiceController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.service.loadAll(au.churchId);
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request, res: express.Response): Promise<void> {
        return this.actionWrapper(req, res, async (au) => {
            await this.repositories.service.delete(id, au.churchId);
            return null;
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Service[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess('Services', 'Edit')) return this.json({}, 401);
            else {
                let services: Service[] = req.body;
                const promises: Promise<Service>[] = [];
                services.forEach((service) => { if (service.churchId === au.churchId) promises.push(this.repositories.service.save(service)); });
                services = await Promise.all(promises);
                return this.json(services, 200);
            }
        });
    }

}
