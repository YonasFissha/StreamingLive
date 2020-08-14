"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerHelper = void 0;
class ControllerHelper {
    static jsonResponse(res, code, message) { return res.status(code).json({ message }); }
    static ok(res, dto) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        }
        else {
            return res.sendStatus(200);
        }
    }
    static invalidRequest(res, message) {
        return ControllerHelper.jsonResponse(res, 400, message ? message : 'Invalid request');
    }
    static fail(res, error) {
        return res.status(500).json({ message: error.toString() });
    }
    static unauthorized(res, message) {
        return ControllerHelper.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }
}
exports.ControllerHelper = ControllerHelper;
//# sourceMappingURL=ControllerHelper.js.map