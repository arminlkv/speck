require("dotenv").config();

import "./polyfill";
import { WebServer } from "./http/WebServer";
import { registerRoutes } from "./http/Routes";

WebServer.instance.start(5431, registerRoutes);
