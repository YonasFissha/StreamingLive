import express from "express"

export class ControllerHelper {
    static jsonResponse(res: express.Response, code: number, message: string) { return res.status(code).json({ message }) }

    static ok<T>(res: express.Response, dto?: T) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    static invalidRequest(res: express.Response, message?: string) {
        return ControllerHelper.jsonResponse(res, 400, message ? message : 'Invalid request');
    }

    static fail(res: express.Response, error: Error | string) {
        return res.status(500).json({ message: error.toString() })
    }

    static unauthorized(res: express.Response, message?: string) {
        return ControllerHelper.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }

}