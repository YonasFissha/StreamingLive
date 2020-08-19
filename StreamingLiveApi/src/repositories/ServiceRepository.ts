import { injectable } from "inversify";
import { DB } from "../db";
import { Service } from "../models";

@injectable()
export class ServiceRepository {
    public insert(service: Service) {
        return DB.queryOne(
            "INSERT INTO services (churchId, serviceTime, earlyStart, duration, chatBefore, chatAfter, provider, providerKey, videoUrl, timezoneOffset, recurring) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [service.churchId, service.serviceTime, service.earlyStart, service.duration, service.chatBefore, service.chatAfter, service.provider, service.proivderKey, service.videoUrl, service.timezoneOffset, service.recurring]
        );
    }

    public update(service: Service) {
        return DB.queryOne("UPDATE services SET serviceTime=?, earlyStart=?, duration=?, chatBefore=?, chatAfter=?, provider=?, providerKey=?, videoUrl=?, timezoneOffset=?, recurring=? WHERE id=?;",
            [service.serviceTime, service.earlyStart, service.duration, service.chatBefore, service.chatAfter, service.provider, service.proivderKey, service.videoUrl, service.timezoneOffset, service.recurring, service.id]);
    }

    public async loadById(id: number, churchId: number): Promise<Service> {
        return DB.queryOne("SELECT * FROM services WHERE id=? AND churchId=?;", [id]);
    }

    public async loadAll(churchId: number): Promise<Service> {
        return DB.query("SELECT * FROM services WHERE churchId=?;", [churchId]);
    }

}
