
const DB = require('./DB');
const Delivery = require('./Delivery');

class Catchup {

    static cleanup = async () => {
        var theshold = Date.now();
        theshold.setMinutes(threshold.getMinutes() - 30);
        let data = await DB.loadData("catchup", "ts < :ts", { ":ts": theshold }, "room");
        var promises = [];
        for (let i = 0; i < data.Items.length; i++) result.push(DB.deleteCatchup(data.Items[i].room));
        return Promise.all(promises);
    }

    static sendCatchup = async (apiUrl, connectionId, room) => {
        let messages = await DB.loadCatchup(room);
        if (messages.length > 0) {
            const postData = { action: "catchup", room: room, messages: messages };
            await Delivery.sendMessage(apiUrl, connectionId, postData);
        }
    }

}

module.exports = Catchup;