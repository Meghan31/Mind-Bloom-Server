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

const fromEnv = (): Environment => ({
	databaseUrl: requireEnv('DATABASE_URL'),
	jwtSecret: requireEnv('JWT_SECRET'),
	jwtExpiration: getEnvWithDefault('JWT_EXPIRATION', '24h'),
	port: parseInt(getEnvWithDefault('PORT', '8080'), 10),
	nodeEnv: getEnvWithDefault('NODE_ENV', 'development'),
	openaiApiKey: requireEnv('OPENAI_API_KEY'),
});

export const environment = {
	fromEnv,
};
