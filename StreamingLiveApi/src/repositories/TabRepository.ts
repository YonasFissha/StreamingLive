import { injectable } from "inversify";
import { DB } from "../db";
import { Tab } from "../models";

@injectable()
export class TabRepository {

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM tabs WHERE churchId=? order by sort", [churchId]);
    }

    public save(tab: Tab) {
        if (tab.id > 0) return this.update(tab); else return this.create(tab);
    }

    public async create(tab: Tab) {
        return DB.query(
            "INSERT INTO tabs (churchId, url, tabType, tabData, icon, text, sort) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [tab.churchId, tab.url, tab.tabType, tab.tabData, tab.icon, tab.text, tab.sort]
        ).then((row: any) => { tab.id = row.insertId; return tab; });
    }

    public async update(tab: Tab) {
        return DB.query("UPDATE tabs SET url=?, tabType=?, tabData=?, icon=?, text=?, sort=? WHERE id=?;", [tab.url, tab.tabType, tab.tabData, tab.icon, tab.text, tab.sort, tab.id])
            .then(() => { return tab });
    }

    public async loadById(id: number, churchId: number): Promise<Tab> {
        return DB.queryOne("SELECT * FROM tabs WHERE id=? AND churchId=?;", [id, churchId]);
    }


}
