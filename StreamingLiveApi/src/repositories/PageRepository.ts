import { injectable } from "inversify";
import { DB } from "../db";
import { Page } from "../models";

@injectable()
export class PageRepository {
  public createNewPage(page: Page) {
    return DB.querySync("INSERT INTO pages (churchId, name, lastModified) VALUES (?, ?, NOW());", [page.churchId, page.name])
  }

  public updateExistingPage(page: Page) {
    return DB.querySync("UPDATE pages SET name=?, lastModified=NOW() WHERE id=?;", [page.name, page.id]);
  }

  public async loadById(id: number, churchId: number): Promise<Page> {
    return DB.queryOne("SELECT * FROM pages WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async loadAll(churchId: number): Promise<Page> {
    return DB.query("SELECT * FROM pages WHERE churchId=?;", [churchId]);
  }

}
