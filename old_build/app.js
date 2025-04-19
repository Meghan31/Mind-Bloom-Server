"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appServer_1 = require("./webSupport/appServer");
var appConfig_1 = require("./appConfig");
var environment_1 = require("./environment");
appServer_1.appServer.start(8787, (0, appConfig_1.configureApp)(environment_1.environment.fromEnv()));
