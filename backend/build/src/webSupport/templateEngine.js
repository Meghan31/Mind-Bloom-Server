"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateEngine = void 0;
const express_handlebars_1 = require("express-handlebars");
const register = (app) => {
    app.engine("handlebars", (0, express_handlebars_1.engine)());
    app.set("view engine", "handlebars");
    app.set("views", __dirname + "/../views");
};
exports.templateEngine = {
    register,
};
