// import { DbHelper } from "../helpers/DbHelper.js";
// import { Role } from "./Role.js";
// export class RoleMember {
//     id: number;
//     roleId: number;
//     userId: number;
//     dateAdded: Date;
//     addedBy: number;
//     private static _getInsertCommand(roleMember: RoleMember) {
//         return DbHelper.executeQuery("INSERT INTO roleMembers (roleId, userId, dateAdded, addedBy) VALUES (?, ?, ?, ?)",
//             [roleMember.roleId, roleMember.userId, roleMember.dateAdded, roleMember.addedBy]
//         );
//     }
//     private static _getUpdateCommand(roleMember: RoleMember) {
//         return DbHelper.executeQuery("UPDATE roleMembers SET roleId=?, userId=?, dateAdded=?, addedBy=? WHERE id=?",
//             [roleMember.roleId, roleMember.userId, roleMember.dateAdded, roleMember.addedBy, roleMember.id]
//         );
//     }
//     static async save(roleMember: RoleMember): Promise<RoleMember> {
//         const promise: Promise<any> = (roleMember.id > 0) ? RoleMember._getUpdateCommand(roleMember) : RoleMember._getInsertCommand(roleMember);
//         await promise.then((data) => {
//             if (data?.insertId !== undefined) roleMember.id = data.insertId;
//         });
//         return roleMember;
//     }
// }
//# sourceMappingURL=RoleMember.js.map