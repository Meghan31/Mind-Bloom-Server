"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseTemplate = void 0;
const pg_1 = require("pg");
const create = (databaseUrl) => {
    const pool = new pg_1.Pool({ connectionString: databaseUrl });
    return {
        queryOne: async (sql, mapping, ...args) => {
            const result = await pool.query(sql, args);
            return mapping(result.rows[0]);
        },
        query: async (sql, mapping, ...args) => {
            const result = await pool.query(sql, args);
            return result.rows.map(mapping);
        },
        execute: async (sql, ...args) => {
            await pool.query(sql, args);
        },
    };
};
exports.databaseTemplate = {
    create,
};
