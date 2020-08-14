import { injectable } from "inversify";
import { DB } from "../db";
import { Link } from "../models";

@injectable()
export class LinkRepository {
    public insert(link: Link) {
        return DB.querySync("INSERT INTO links (churchId, url, text, sort) VALUES (?, ?, ?, ?);", [link.churchId, link.url, link.text, link.sort])
    }

    public update(link: Link) {
        return DB.querySync("UPDATE links SET url=?, text=?, sort=? WHERE id=?;", [link.url, link.text, link.sort, link.id]);
    }

    public async loadById(id: number, churchId: number): Promise<Link> {
        return DB.queryOne("SELECT * FROM links WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number): Promise<Link> {
        return DB.query("SELECT * FROM links WHERE churchId=?;", [churchId]);
    }

}
