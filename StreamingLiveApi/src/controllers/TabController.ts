
import { controller, httpPost, httpGet } from "inversify-express-utils";
import { Tab } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/tabs")
export class TabController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            return await this.repositories.tab.loadAll(this.au().churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Tab[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async () => {
            if (!this.au().checkAccess('Tabs', 'Edit')) return this.json({}, 401);
            else {
                let tabs: Tab[] = req.body;
                const promises: Promise<Tab>[] = [];
                tabs.forEach((tab) => { if (tab.churchId === this.au().churchId) promises.push(this.repositories.tab.save(tab)); });
                tabs = await Promise.all(promises);
                return this.json(tabs, 200);
            }
        });
    }

}




