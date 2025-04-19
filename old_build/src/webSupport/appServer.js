"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appServer = void 0;
const express_1 = __importDefault(require("express"));
const templateEngine_1 = require("./templateEngine");
const start = async (port, configure) => {
    const app = (0, express_1.default)();
    configure(app);
    templateEngine_1.templateEngine.register(app);
    const server = await new Promise((resolve, reject) => {
        const cancelTimer = setTimeout(() => reject("Server failed to start in 5 seconds"), 5_000);
        const httpServer = app.listen(port, () => {
            if (port !== 0) {
                console.log(`App listening on http://localhost:${port}`);
            }
            clearTimeout(cancelTimer);
            resolve(httpServer);
        });
    });
    const address = server.address();
    return {
        address: `http://localhost:${address.port}`,
        stop: () => server.close(),
    };
};
exports.appServer = {
    start,
};
