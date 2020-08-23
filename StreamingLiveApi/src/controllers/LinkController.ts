
import { controller, httpPost, httpGet, httpDelete, requestParam } from "inversify-express-utils";
import { Link } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";

@controller("/links")
export class LinkController extends CustomBaseController {
    @httpGet("/")
    public async loadAll(req: express.Request, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.link.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Link[]>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess('Links', 'Edit')) return this.json({}, 401);
            else {
                let links: Link[] = req.body;
                const promises: Promise<Link>[] = [];
                links.forEach((link) => { if (link.churchId === au.churchId) promises.push(this.repositories.link.save(link)); });
                links = await Promise.all(promises);
                return this.json(links, 200);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request, res: express.Response): Promise<void> {
        return this.actionWrapper(req, res, async (au) => {
            await this.repositories.link.delete(id, au.churchId);
            return null;
        });
    }

}


