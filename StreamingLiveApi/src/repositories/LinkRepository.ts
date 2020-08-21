import { injectable } from "inversify";
import { DB } from "../db";
import { Link } from "../models";

@injectable()
export class LinkRepository {
    public save(link: Link) {
        if (link.id > 0) return this.update(link); else return this.create(link);
    }

    public async create(link: Link) {
        return DB.query("INSERT INTO links (churchId, url, text, sort) VALUES (?, ?, ?, ?);", [link.churchId, link.url, link.text, link.sort])
            .then((row: any) => { link.id = row.insertId; return link; });
    }

    public async update(link: Link) {
        return DB.query("UPDATE links SET url=?, text=?, sort=? WHERE id=?;", [link.url, link.text, link.sort, link.id])
            .then(() => { return link });
    }

    public async loadById(id: number, churchId: number): Promise<Link> {
        return DB.queryOne("SELECT * FROM links WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number): Promise<Link> {
        return DB.query("SELECT * FROM links WHERE churchId=? order by sort;", [churchId]);
    }

}
