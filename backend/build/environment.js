"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
var requireEnv = function (name) {
    var value = process.env[name];
    if (value === undefined || value === "") {
        throw new Error("Environment variable ".concat(name, " is required, but was not found"));
    }
    return value;
};
var fromEnv = function () { return ({
    databaseUrl: requireEnv("DATABASE_URL"),
}); };
exports.environment = {
    fromEnv: fromEnv,
};
