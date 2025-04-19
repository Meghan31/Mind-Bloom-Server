"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const registerHandler = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });
};
exports.index = {
    registerHandler,
};
