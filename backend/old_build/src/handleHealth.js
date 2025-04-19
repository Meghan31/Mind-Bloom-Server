"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
const checkDb = async (dbTemplate) => {
    try {
        return await dbTemplate.queryOne("select true as success", (result) => result["success"]);
    }
    catch (e) {
        console.error(e);
        return false;
    }
};
const registerHandler = (app, dbTemplate) => {
    app.get("/health", async (req, res) => {
        const success = await checkDb(dbTemplate);
        if (success) {
            res.json({ status: "UP" });
        }
        else {
            res.json({ status: "DOWN" });
        }
    });
};
exports.health = {
    registerHandler,
};
