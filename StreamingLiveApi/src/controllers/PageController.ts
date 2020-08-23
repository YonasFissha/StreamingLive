import { controller, httpPost, httpGet, httpDelete, requestParam } from "inversify-express-utils";
import { Page } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";
import { AwsHelper } from "../helpers";

@controller("/pages")
export class PageController extends CustomBaseController {

  @httpGet("/")
  public async loadAll(req: express.Request, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.page.loadAll(au.churchId);
    });
  }

  @httpGet("/:id")
  public async load(@requestParam("id") id: number, req: express.Request, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const result = await this.repositories.page.loadById(id, au.churchId);
      if (this.include(req, 'content')) {
        const settings = await this.repositories.setting.loadAll(au.churchId);
        const path = 'data/' + settings[0].keyName + '/page' + id + '.html';
        result.content = await AwsHelper.S3Read(path);
      }
      return result;
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Page[]>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess('Pages', 'Edit')) return this.json({}, 401);
      else {
        let pages: Page[] = req.body;
        const promises: Promise<Page>[] = [];
        pages.forEach((page) => {
          if (page.churchId === au.churchId) promises.push(
            this.repositories.page.save(page).then(async (p) => {
              if (page.content !== undefined) {
                const settings = await this.repositories.setting.loadAll(au.churchId);
                const path = 'data/' + settings[0].keyName + '/page' + p.id + '.html';
                console.log(path);
                const buffer = Buffer.from(page.content, 'binary');
                await AwsHelper.S3Upload(path, "text/html", buffer)
              }
              return p;
            })
          )
        });
        pages = await Promise.all(promises);
        return this.json(pages, 200);
      }
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: number, req: express.Request, res: express.Response): Promise<void> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.page.delete(id, au.churchId);
      return null;
    });
  }
}
