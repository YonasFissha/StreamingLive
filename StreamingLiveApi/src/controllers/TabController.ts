
import { controller, httpPost, httpGet, httpDelete, requestParam } from "inversify-express-utils";
import { Tab } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/tabs")
export class TabController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.tab.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Tab[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess('Tabs', 'Edit')) return this.json({}, 401);
            else {
                let tabs: Tab[] = req.body;
                const promises: Promise<Tab>[] = [];
                tabs.forEach((tab) => { if (tab.churchId === au.churchId) promises.push(this.repositories.tab.save(tab)); });
                tabs = await Promise.all(promises);
                return this.json(tabs, 200);
            }
        });
    }


    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request, res: express.Response): Promise<void> {
        return this.actionWrapper(req, res, async (au) => {
            await this.repositories.tab.delete(id, au.churchId);
            return null;
        });
    }



}




