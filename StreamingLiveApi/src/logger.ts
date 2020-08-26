import { injectable } from "inversify";
import "reflect-metadata";
import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import AWS from 'aws-sdk';

@injectable()
export class WinstonLogger {
    private _logger: winston.Logger;

    public get logger(): winston.Logger {
        return this._logger;
    }

    constructor() {
        this._logger = winston.createLogger({
            // This transports array can be changed to be any logger transport (e.g. AWS cloudwatch)
            // transports: [new winston.transports.Console()],
            transports: [this.getCloudwatchTransport()],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            ),
        });
        this._logger.error("Logger initialized");
    }

    public getCloudwatchTransport = () => {
        AWS.config.update({ region: 'us-east-2' });
        return new WinstonCloudWatch({
            logGroupName: 'StreamingLiveStage', // REQUIRED
            logStreamName: 'API', // REQUIRED
        });
    }

}
