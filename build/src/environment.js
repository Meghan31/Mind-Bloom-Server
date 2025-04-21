"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const requireEnv = (name) => {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(`Environment variable ${name} is required, but was not found`);
    }
    return value;
};
const getEnvWithDefault = (name, defaultValue) => {
    const value = process.env[name];
    return value === undefined || value === '' ? defaultValue : value;
};
const fromEnv = () => ({
    databaseUrl: requireEnv('DATABASE_URL'),
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiration: getEnvWithDefault('JWT_EXPIRATION', '24h'),
    port: parseInt(getEnvWithDefault('PORT', '8080'), 10),
    nodeEnv: getEnvWithDefault('NODE_ENV', 'development'),
    openaiApiKey: requireEnv('OPENAI_API_KEY'),
});
exports.environment = {
    fromEnv,
};
