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
        AWS.config.update({ region: 'us-east-2' });
        const wc = new WinstonCloudWatch({ logGroupName: 'StreamingLiveStage', logStreamName: 'API' });
        this._logger = winston.createLogger({ transports: [wc], format: winston.format.json() });
        this._logger.error("Logger initialized");
    }

}
