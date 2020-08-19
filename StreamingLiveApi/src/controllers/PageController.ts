import { inject } from "inversify";
import { controller, httpPost, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import { Page } from "../models";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'

@controller("/pages")
export class PageController extends BaseHttpController {
  private repositories: Repositories;
  private _logger: WinstonLogger;

  constructor(@inject(TYPES.Repositories) repositories: Repositories, @inject(TYPES.LoggerService) logger: WinstonLogger) {
    super()
    this.repositories = repositories;
    this._logger = logger;
  }

  @httpGet("/")
  public async loadAll(req: express.Request, res: express.Response): Promise<void> {
    //const page = req.body.page;

    return null;
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Page[]>, res: express.Response): Promise<any> {
    try {
      const au: AuthenticatedUser = new AuthenticatedUser(this.httpContext.user);
      if (!au.checkAccess('Pages', 'Edit')) return this.json({}, 401);
      else {

        let pages: Page[] = req.body;
        const promises: Promise<Page>[] = [];
        pages.forEach((page) => {
          if (page.churchId === au.churchId) promises.push(this.repositories.page.save(page));
        });
        pages = await Promise.all(promises);
        return this.json(pages, 200);
      }
    } catch (e) {
      this._logger.logger.error(e);
      return this.internalServerError(e);
    }
  }

}
