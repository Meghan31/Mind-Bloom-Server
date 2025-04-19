"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateEngine = void 0;
var express_handlebars_1 = require("express-handlebars");
var register = function (app) {
    app.engine("handlebars", (0, express_handlebars_1.engine)());
    app.set("view engine", "handlebars");
    app.set("views", __dirname + "/../views");
};
exports.templateEngine = {
    register: register,
};
