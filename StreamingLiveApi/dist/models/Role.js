// import { DbHelper } from "../helpers/DbHelper.js";
// export class Role {
//     // *** The data I want to return from the api isn't always a 1:1 match with what's in the database.  Should I have seperate data access classes and convert betwen them and api interfaces?  */
//     id: number;
//     churchId: number;
//     appName: string;
//     name: string;
//     private static _getInsertCommand(role: Role) {
//         return DbHelper.executeQuery("INSERT INTO roles (churchId, appName, name) VALUES (?, ?, ?)",
//             [role.churchId, role.appName, role.name]
//         );
//     }
//     private static _getUpdateCommand(role: Role) {
//         return DbHelper.executeQuery("UPDATE roles SET churchId=?, appName=?, name=? WHERE id=?",
//             [role.churchId, role.appName, role.name, role.id]
//         );
//     }
//     static async save(role: Role): Promise<Role> {
//         const promise: Promise<any> = (role.id > 0) ? Role._getUpdateCommand(role) : Role._getInsertCommand(role);
//         await promise.then((data) => { if (data?.insertId !== undefined) role.id = data.insertId; });
//         return role;
//     }
// }
//# sourceMappingURL=Role.js.map