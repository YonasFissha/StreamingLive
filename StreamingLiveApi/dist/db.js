"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const pool_1 = require("./pool");
class DB {
    static usePooledConnectionAsync(actionAsync) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield new Promise((resolve, reject) => {
                pool_1.mySQLPool.getConnection((ex, conn) => { if (ex)
                    reject(ex);
                else
                    resolve(conn); });
            });
            try {
                return yield actionAsync(connection);
            }
            finally {
                connection.release();
            }
        });
    }
    static queryOne(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(sql, params).then((result) => {
                return result.length > 0 ? result[0].value : null;
            });
        });
    }
    static query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usePooledConnectionAsync((connection) => __awaiter(this, void 0, void 0, function* () {
                const result = yield new Promise((resolve, reject) => {
                    connection.query(sql, params, (ex, rows) => { if (ex)
                        reject(ex);
                    else
                        resolve(rows); });
                });
                return result;
            }));
        });
    }
}
exports.DB = DB;
//# sourceMappingURL=db.js.map