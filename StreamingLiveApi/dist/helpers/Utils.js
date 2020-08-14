"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
}
exports.Utils = Utils;
Utils.generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
//# sourceMappingURL=Utils.js.map