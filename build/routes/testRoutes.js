"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTestRoutes = void 0;
var registerTestRoutes = function (app) {
    // Test endpoint to verify routing is working
    app.get('/api/test', function (req, res) {
        res.json({ message: 'API test endpoint is working!' });
    });
    // Test endpoint to verify POST requests are working
    app.post('/api/test', function (req, res) {
        var receivedData = req.body;
        res.status(200).json({
            message: 'POST test endpoint is working!',
            received: receivedData,
        });
    });
};
exports.registerTestRoutes = registerTestRoutes;
