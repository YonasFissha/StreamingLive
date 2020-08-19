import { injectable } from "inversify";
import "reflect-metadata";
import winston from "winston";

@injectable()
export class WinstonLogger {
    private _logger: winston.Logger;

    public get logger(): winston.Logger {
        return this._logger;
    }

    constructor() {
        this._logger = winston.createLogger({
            // This transports array can be changed to be any logger transport (e.g. AWS cloudwatch)
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            ),
        });
    }
}
