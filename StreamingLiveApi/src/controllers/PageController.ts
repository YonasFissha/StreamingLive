import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { TYPES } from "../constants";
import { PageRepository } from "../repositories";
import { Page } from "../models";
import express from "express";

@controller("/pages")
export class PageController {
  private pageRepository: PageRepository;

  constructor(@inject(TYPES.UserRepository) pageRepository: PageRepository) {
    console.log("Creating page controller");
    this.pageRepository = pageRepository;
    console.log("Page repository is set");
  }

  @httpPost("/")
  public async save(req: express.Request, res: express.Response): Promise<void> {
    const page = req.body.page;
    if (page.id === 0) this.pageRepository.createNewPage(req.body.page);
    else this.pageRepository.updateExistingPage(req.body.page);
    return null;
  }

}
