import { injectable } from "inversify";
import { DB } from "../db";
import { Page } from "../models";

@injectable()
export class PageRepository {

  public save(page: Page) {
    if (page.id > 0) return this.update(page); else return this.create(page);
  }

  public async create(page: Page) {
    return DB.query("INSERT INTO pages (churchId, name, lastModified) VALUES (?, ?, NOW());", [page.churchId, page.name])
      .then((row: any) => { page.id = row.insertId; return page; });
  }

  public async update(page: Page) {
    return DB.query("UPDATE pages SET name=?, lastModified=NOW() WHERE id=? AND churchId=?;", [page.name, page.id, page.churchId])
      .then(() => { return page });
  }

  public async delete(id: number, churchId: number) {
    DB.query("DELETE FROM pages WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async loadById(id: number, churchId: number): Promise<Page> {
    return DB.queryOne("SELECT * FROM pages WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async loadAll(churchId: number): Promise<Page> {
    return DB.query("SELECT * FROM pages WHERE churchId=?;", [churchId]);
  }


}
