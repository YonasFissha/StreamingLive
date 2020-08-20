import { injectable } from "inversify";
import { DB } from "../db";
import { Setting } from "../models";

@injectable()
export class SettingRepository {

    public save(setting: Setting) {
        if (setting.id > 0) return this.update(setting); else return this.create(setting);
    }

    public async create(setting: Setting) {
        return DB.query(
            "INSERT INTO settings (churchId, keyName, homePageUrl, logoUrl, primaryColor, contrastColor, registrationDate) VALUES (?, ?, ?, ?, ?, ?, NOW());",
            [setting.churchId, setting.keyName, setting.homePageUrl, setting.logoUrl, setting.primaryColor, setting.contrastColor]
        ).then((row: any) => { setting.id = row.insertId; return setting; });
    }

    public async update(setting: Setting) {
        return DB.query(
            "UPDATE settings SET keyName=?, homePageUrl=?, logoUrl=?, primaryColor=?, contrastColor=?, registrationDate=? WHERE id=?;",
            [setting.churchId, setting.keyName, setting.homePageUrl, setting.logoUrl, setting.primaryColor, setting.contrastColor]
        ).then(() => { return setting });
    }


}