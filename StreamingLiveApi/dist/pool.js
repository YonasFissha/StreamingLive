"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySQLPool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
dotenv_1.default.config();
console.log(process.env);
exports.mySQLPool = mysql_1.default.createPool({
    connectionLimit: 5,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
});
//# sourceMappingURL=pool.js.map