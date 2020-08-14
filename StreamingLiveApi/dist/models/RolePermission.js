"use strict";
// import { DbHelper } from "../helpers/DbHelper.js";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
class RolePermission {
}
exports.RolePermission = RolePermission;
//     static async loadByUserId(userId: number): Promise<RolePermission[]> {
//         return DbHelper.executeQuery("SELECT rp.* FROM rolePermissions rp INNER JOIN roleMembers rm on rm.roleId=rp.roleId WHERE rm.userId=?", [userId]).then((data) => { return data as RolePermission[] });
//     }
//     private static _getInsertCommand(rolePermission: RolePermission) {
//         return DbHelper.executeQuery("INSERT INTO rolePermissions (roleId, contentType, contentId, action) VALUES (?, ?, ?, ?)",
//             [rolePermission.roleId, rolePermission.contentType, rolePermission.contentId, rolePermission.action]
//         );
//     }
//     private static _getUpdateCommand(rolePermission: RolePermission) {
//         return DbHelper.executeQuery("UPDATE rolePermissions SET roleId=?, contentType=?, contentId=?, action=? WHERE id=?",
//             [rolePermission.roleId, rolePermission.contentType, rolePermission.contentId, rolePermission.action, rolePermission.id]
//         );
//     }
//     static async save(rolePermission: RolePermission): Promise<RolePermission> {
//         const promise: Promise<any> = (rolePermission.id > 0) ? RolePermission._getUpdateCommand(rolePermission) : RolePermission._getInsertCommand(rolePermission);
//         await promise.then((data) => {
//             if (data?.insertId !== undefined) rolePermission.id = data.insertId;
//         });
//         return rolePermission;
//     }
// }
//# sourceMappingURL=RolePermission.js.map