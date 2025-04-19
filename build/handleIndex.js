"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
var registerHandler = function (app) {
    app.get("/", function (req, res) {
        res.render("index");
    });
};
exports.index = {
    registerHandler: registerHandler,
};
