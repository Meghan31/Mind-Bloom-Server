"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/networkTest.ts
const net = __importStar(require("net"));
function testConnection(host, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);
        socket.on('connect', () => {
            socket.destroy();
            console.log(`✅ Successfully connected to ${host}:${port}`);
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            console.log(`❌ Connection to ${host}:${port} timed out`);
            resolve(false);
        });
        socket.on('error', (err) => {
            socket.destroy();
            console.log(`❌ Connection to ${host}:${port} failed:`, err.message);
            resolve(false);
        });
        socket.connect(port, host);
    });
}
async function runNetworkTests() {
    console.log('Network Connectivity Test');
    console.log('------------------------');
    const hostToTest = 'aws-0-us-east-2.pooler.supabase.com';
    const portsToTest = [6543, 5432];
    for (const port of portsToTest) {
        console.log(`\nTesting connection to ${hostToTest}:${port}`);
        const result = await testConnection(hostToTest, port);
        console.log(result ? 'Connection successful' : 'Connection failed');
    }
}
runNetworkTests();
