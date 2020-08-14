import { injectable } from "inversify";
import { DB } from "../db";
import { Tab } from "../models";

@injectable()
export class TabRepository {
    public insert(tab: Tab) {
        return DB.querySync("INSERT INTO tabs (churchId, url, type, data, icon, text, sort) VALUES (?, ?, ?, ?, ?, ?, ?);", [tab.churchId, tab.url, tab.type, tab.data, tab.icon, tab.text, tab.sort])
    }

    public update(tab: Tab) {
        return DB.querySync("UPDATE tabs SET url=?, type=?, data=?, icon=?, text=?, sort=? WHERE id=?;", [tab.url, tab.type, tab.data, tab.icon, tab.text, tab.sort, tab.id]);
    }

    public async loadById(id: number, churchId: number): Promise<Tab> {
        return DB.queryOne("SELECT * FROM tabs WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number): Promise<Tab> {
        return DB.query("SELECT * FROM tabs WHERE churchId=?;", [churchId]);
    }

}
