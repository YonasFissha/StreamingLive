import { inject } from "inversify";
import { controller, httpPost, httpGet } from "inversify-express-utils";
import { TYPES } from "../constants";
import { PageRepository } from "../repositories";
import { Page } from "../models";
import express from "express";

@controller("/pages")
export class PageController {
  private pageRepository: PageRepository;

  constructor(@inject(TYPES.UserRepository) pageRepository: PageRepository) {
    this.pageRepository = pageRepository;
  }

  @httpGet("/")
  public async loadAll(req: express.Request, res: express.Response): Promise<void> {
    //const page = req.body.page;

    return null;
  }

  @httpPost("/")
  public async save(req: express.Request, res: express.Response): Promise<void> {
    const page = req.body.page;
    if (page.id === 0) this.pageRepository.createNewPage(req.body.page);
    else this.pageRepository.updateExistingPage(req.body.page);
    return null;
  }

}
