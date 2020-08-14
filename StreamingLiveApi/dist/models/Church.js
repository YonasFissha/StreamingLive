// import { DbHelper } from "../helpers/DbHelper.js";
// export class Church {
//     id: number;
//     name: string;
//     registrationDate: Date;
//     private static _getInsertCommand(church: Church) {
//         return DbHelper.executeQuery("INSERT INTO churches (name) VALUES (?);", [church.name]);
//     }
//     private static _getUpdateCommand(church: Church) {
//         return DbHelper.executeQuery("UPDATE churches SET name=? WHERE id=?", [church.name, church.id]);
//     }
//     static async save(church: Church): Promise<Church> {
//         const promise: Promise<any> = (church.id > 0) ? Church._getUpdateCommand(church) : Church._getInsertCommand(church);
//         await promise.then((data) => {
//             if (data?.insertId !== undefined) church.id = data.insertId;
//         });
//         return church;
//     }
// }
//# sourceMappingURL=Church.js.map