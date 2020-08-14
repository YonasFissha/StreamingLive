"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const constants_1 = require("../constants");
const repositories_1 = require("../repositories");
const models_1 = require("../models");
const express_1 = __importDefault(require("express"));
let UserController = class UserController {
    constructor(userRepository) {
        console.log("Creating user controller");
        this.userRepository = userRepository;
        console.log("User repository is set");
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.loadByEmail(req.body.email);
            if (user == null) {
                console.log("I am registering a new user email");
                return new models_1.User();
            }
            console.log("I successfully loaded a user by email");
            return new models_1.User();
        });
    }
};
__decorate([
    inversify_express_utils_1.httpPost("/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.default !== "undefined" && express_1.default.Request) === "function" ? _a : Object, typeof (_b = typeof express_1.default !== "undefined" && express_1.default.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
UserController = __decorate([
    inversify_express_utils_1.controller("/users"),
    __param(0, inversify_1.inject(constants_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [repositories_1.UserRepository])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map