

import _ from "lodash";
import express, { Express } from "express";
import bodyParser from "body-parser";

class WebServer {
  private _server: Express;

  private static _instance: WebServer;

  public static get instance(): WebServer {
    if (!WebServer._instance) {
      WebServer._instance = new WebServer();
    }

    return WebServer._instance;
  }

  private constructor() {
    if (WebServer._instance) {
      throw new Error(
        "WebServer instance already exists. Use WebServer.instance to access it."
      );
    }

    this._server = express();
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: true }));
  }

  public get(
    path: string,
    handler: express.RequestHandler,
    middleware?: Array<(req: any, res: any) => boolean>
  ): void {
    this.registerRoute("get", path, handler, middleware);
  }

  public post(
    path: string,
    handler: express.RequestHandler,
    middleware?: Array<(req: any, res: any) => boolean>
  ): void {
    this.registerRoute("post", path, handler, middleware);
  }

  private registerRoute(
    method: string,
    path: string,
    handler: express.RequestHandler,
    middleware?: Array<express.RequestHandler>
  ): void {
    this._server[method](path, (req: any, res: any, next: any) => {
      handler(req, res, next);
    });

    if (middleware && middleware.length > 0) {
      this._server.use(path, middleware);
    }
  }

  public start(port: number, registerEndpointsCallback: Function): void {
    registerEndpointsCallback();

    this._server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export { WebServer };

