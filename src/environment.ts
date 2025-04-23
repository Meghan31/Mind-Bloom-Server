// src/environment.ts
export type Environment = {
	databaseUrl: string;
	jwtSecret: string;
	jwtExpiration: string;
	port: number;
	nodeEnv: string;
	openaiApiKey: string;
};

const requireEnv = (name: string): string => {
	const value = process.env[name];
	if (value === undefined || value === '') {
		// In development, provide fallbacks for easier setup
		if (process.env.NODE_ENV === 'development') {
			switch (name) {
				case 'JWT_SECRET':
					console.warn('WARNING: Using default JWT_SECRET in development mode');
					return 'dev-jwt-secret-key-mind-bloom-application';
				case 'DATABASE_URL':
					console.warn('WARNING: DATABASE_URL not set, check your .env file');
					break;
				case 'OPENAI_API_KEY':
					console.warn(
						'WARNING: OPENAI_API_KEY not set, quotation features may not work'
					);
					break;
			}
		}
		throw new Error(
			`Environment variable ${name} is required, but was not found`
		);
	}
	return value;
};

const getEnvWithDefault = (name: string, defaultValue: string): string => {
	const value = process.env[name];
	return value === undefined || value === '' ? defaultValue : value;
};

const fromEnv = (): Environment => {
	try {
		const environment = {
			databaseUrl: requireEnv('DATABASE_URL'),
			jwtSecret: requireEnv('JWT_SECRET'),
			jwtExpiration: getEnvWithDefault('JWT_EXPIRATION', '24h'),
			port: parseInt(getEnvWithDefault('PORT', '8080'), 10),
			nodeEnv: getEnvWithDefault('NODE_ENV', 'development'),
			openaiApiKey: requireEnv('OPENAI_API_KEY'),
		};

		// Log the environment configuration (without sensitive details)
		console.log('Environment configuration loaded:');
		console.log('- NODE_ENV:', environment.nodeEnv);
		console.log('- PORT:', environment.port);
		console.log('- JWT_EXPIRATION:', environment.jwtExpiration);
		console.log(
			'- DATABASE_URL:',
			environment.databaseUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
		);
		console.log(
			'- OPENAI_API_KEY:',
			environment.openaiApiKey ? '[Set]' : '[Not Set]'
		);

		return environment;
	} catch (error) {
		console.error('Error loading environment configuration:', error);
		throw error;
	}
};

export const environment = {
	fromEnv,
};
