// scripts/networkTest.ts
import * as net from 'net';

function testConnection(host: string, port: number): Promise<boolean> {
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
