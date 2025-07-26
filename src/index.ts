require("dotenv").config();

import { WebServer } from "./http/WebServer";
import { registerRoutes } from "./http/Routes";

WebServer.instance.start(5431, registerRoutes);
