import { DB } from './DB';
import { Delivery } from './Delivery';

export class Catchup {

    static cleanup = async () => {
        const threshold = new Date(Date.now());
        threshold.setMinutes(threshold.getMinutes() - 30);
        const data = await DB.loadData(process.env.CATCHUP_TABLE, "ts < :ts", { ":ts": threshold }, "room");
        const promises: Promise<any>[] = [];
        data.Items.forEach(item => { promises.push(DB.deleteCatchup(item.room)) });
        return Promise.all(promises);
    }

    static sendCatchup = async (apiUrl: string, connectionId: string, room: string) => {
        const messages = await DB.loadCatchup(room);
        if (messages.length > 0) {
            const postData = { action: "catchup", room, messages };
            await Delivery.sendMessage(apiUrl, connectionId, postData);
        }
    }
}