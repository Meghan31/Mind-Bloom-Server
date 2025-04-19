"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appServer_1 = require("./webSupport/appServer");
const appConfig_1 = require("./appConfig");
const environment_1 = require("./environment");
appServer_1.appServer.start(8787, (0, appConfig_1.configureApp)(environment_1.environment.fromEnv()));
