"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const requireEnv = (name) => {
    const value = process.env[name];
    if (value === undefined || value === "") {
        throw new Error(`Environment variable ${name} is required, but was not found`);
    }
    return value;
};
const fromEnv = () => ({
    databaseUrl: requireEnv("DATABASE_URL"),
});
exports.environment = {
    fromEnv,
};
