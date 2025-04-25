// import {afterEach, beforeEach, describe, expect, test} from "vitest";
// import {appServer, AppServer} from "./webSupport/appServer";
// import {testDbTemplate} from "./testSupport/databaseTestSupport";
// import {health} from "./handleHealth";

// describe("handleHealth", async () => {
//     let server: AppServer;
//     const template = await testDbTemplate("handleHealth")

//     beforeEach(async () => {
//         server = await appServer.start(0, app => {
//             health.registerHandler(app, template);
//         });
//     });

//     afterEach(() => {
//         server.stop();
//     });

//     test("get /health", async () => {
//         const response = await fetch(`${server.address}/health`);

//         expect(response.status).toEqual(200);
//         expect(await response.json()).toEqual({status: "UP"});
//     });
// });

// src/handleHealth.test.ts
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { DatabaseTemplate } from './databaseSupport/databaseTemplate';
import { health } from './handleHealth';
import { appServer, AppServer } from './webSupport/appServer';

// Create mock database template
const mockDbTemplate: DatabaseTemplate = {
	queryOne: vi.fn().mockImplementation(async (sql, mapping) => {
		// Simulate successful database query
		if (sql.includes('select true as success')) {
			return mapping({ success: true });
		}
		return false;
	}),
	query: vi.fn().mockResolvedValue([]),
	execute: vi.fn().mockResolvedValue(undefined),
};

describe('handleHealth', async () => {
	let server: AppServer;

	beforeEach(async () => {
		server = await appServer.start(0, (app) => {
			health.registerHandler(app, mockDbTemplate);
		});
	});

	afterEach(() => {
		server.stop();
	});

	test('get /health', async () => {
		const response = await fetch(`${server.address}/health`);

		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ status: 'UP' });
	});

	test('health returns DOWN when database check fails', async () => {
		// Temporarily mock the database check to fail
		const originalQueryOne = mockDbTemplate.queryOne;
		mockDbTemplate.queryOne = vi
			.fn()
			.mockRejectedValue(new Error('Database connection error'));

		// Make the request
		const response = await fetch(`${server.address}/health`);

		// Verify response
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ status: 'DOWN' });

		// Restore the original function
		mockDbTemplate.queryOne = originalQueryOne;
	});
});
