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
exports.bindings = void 0;
const inversify_1 = require("inversify");
const repositories_1 = require("./repositories");
const constants_1 = require("./constants");
const logger_1 = require("./logger");
// This is where all of the binding for constructor injection takes place
exports.bindings = new inversify_1.AsyncContainerModule((bind) => __awaiter(void 0, void 0, void 0, function* () {
    yield require("./controllers");
    bind(constants_1.TYPES.LinkRepository).to(repositories_1.LinkRepository).inSingletonScope();
    bind(constants_1.TYPES.PageRepository).to(repositories_1.PageRepository).inSingletonScope();
    bind(constants_1.TYPES.Repositories).to(repositories_1.Repositories).inSingletonScope();
    bind(constants_1.TYPES.ServiceRepository).to(repositories_1.ServiceRepository).inSingletonScope();
    bind(constants_1.TYPES.TabRepository).to(repositories_1.TabRepository).inSingletonScope();
    bind(constants_1.TYPES.LoggerService).to(logger_1.WinstonLogger);
}));
//# sourceMappingURL=inversify.config.js.map