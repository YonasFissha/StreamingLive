import dotenv from "dotenv";
import bodyParser from "body-parser";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { bindings } from "./inversify.config";
import express from "express";

(async () => {
  dotenv.config();
  const port = process.env.SERVER_PORT;
  const container = new Container();
  await container.loadAsync(bindings);
  const app = new InversifyExpressServer(container);

  const configFunction = (expApp: express.Application) => {
    expApp.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    expApp.use(bodyParser.json());
  };

  const server = app.setConfig(configFunction).build();

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
})();
