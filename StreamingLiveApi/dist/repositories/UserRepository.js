"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const db_1 = require("../db");
let UserRepository = class UserRepository {
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield db_1.usePooledConnectionAsync((connection) => __awaiter(this, void 0, void 0, function* () {
                const result = yield new Promise((resolve, reject) => {
                    connection.query("INSERT INTO users (email, password, authGuid, displayName, registrationDate, lastLogin) VALUES (?, ?, ?, ?, ?, ?);", [
                        user.email,
                        user.password,
                        user.authGuid,
                        user.displayName,
                        user.registrationDate,
                        user.lastLogin,
                    ], (ex, rows) => {
                        if (ex) {
                            reject(ex);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
                return result[0].value;
            }));
            console.log(ret);
            return ret;
        });
    }
    updateExistingUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usePooledConnectionAsync((connection) => __awaiter(this, void 0, void 0, function* () {
                const result = yield new Promise((resolve, reject) => {
                    connection.query("UPDATE users SET email=?, password=?, authGuid=?, displayName=?, registrationDate=?, lastLogin=? WHERE id=?;", [
                        user.email,
                        user.password,
                        user.authGuid,
                        user.displayName,
                        user.registrationDate,
                        user.lastLogin,
                        user.id,
                    ], (ex, rows) => {
                        if (ex) {
                            reject(ex);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
                return result[0].value;
            }));
        });
    }
    loadByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.usePooledConnectionAsync((connection) => __awaiter(this, void 0, void 0, function* () {
                const result = yield new Promise((resolve, reject) => {
                    connection.query("SELECT * FROM users WHERE email=?", [email], (ex, rows) => {
                        if (ex) {
                            reject(ex);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
                console.log(result);
                return result.length > 0 ? result[0].value : null;
            }));
        });
    }
};
UserRepository = __decorate([
    inversify_1.injectable()
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map