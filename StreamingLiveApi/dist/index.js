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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_config_1 = require("./inversify.config");
(() => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const port = process.env.SERVER_PORT;
    const container = new inversify_1.Container();
    yield container.loadAsync(inversify_config_1.bindings);
    const app = new inversify_express_utils_1.InversifyExpressServer(container);
    const configFunction = (expApp) => {
        expApp.use(body_parser_1.default.urlencoded({
            extended: true,
        }));
        expApp.use(body_parser_1.default.json());
    };
    const server = app.setConfig(configFunction).build();
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}))();
//# sourceMappingURL=index.js.map