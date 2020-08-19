import { injectable } from "inversify";
import { DB } from "../db";
import { Page } from "../models";

@injectable()
export class PageRepository {

  public save(page: Page) {
    if (page.id > 0) return this.update(page); else return this.create(page);
  }

  public async create(page: Page) {
    page.id = (await DB.queryOne("INSERT INTO pages (churchId, name, lastModified) VALUES (?, ?, NOW());", [page.churchId, page.name])).insertId;
    return page;
  }

  public async update(page: Page) {
    await DB.queryOne("UPDATE pages SET name=?, lastModified=NOW() WHERE id=?;", [page.name, page.id]);
    return page;
  }

  public async loadById(id: number, churchId: number): Promise<Page> {
    return DB.queryOne("SELECT * FROM pages WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async loadAll(churchId: number): Promise<Page> {
    return DB.query("SELECT * FROM pages WHERE churchId=?;", [churchId]);
  }

}
