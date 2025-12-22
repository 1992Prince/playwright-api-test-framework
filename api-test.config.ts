
const processEnv = process.env.TEST_ENV;
const env = processEnv || 'dev';

console.log('Running tests on environment:', env.toUpperCase());

// default configuration values (DEV defaults)
const config = {
  apiUrl: process.env.API_URL || 'https://conduit-api.bondaracademy.com/api',
  userEmail: process.env.USER_EMAIL || 'testbondar1@gmail.com',
  userPassword: process.env.USER_PASSWORD || 'testbondar1',
  dbPassword: process.env.DB_PASSWORD || 'password123',
  Release: process.env.RELEASE || '21.09',
  Application: process.env.APPLICATION || 'Conduit-API',
  Env: env,
  authTokenBaseUrl:
    process.env.AUTH_TOKEN_BASE_URL ||
    'https://dev-dj4vuaaxgimt7erd.us.auth0.com/oauth/token',
  authAutoInsuranceBaseUrl:
    process.env.AUTO_INSURANCE_BASE_URL ||
    'https://generalinsurance-ff4b.restdb.io/rest'
};

// QA overrides (only if not overridden via env vars)
if (env === 'QA') {
  config.apiUrl =
    process.env.API_URL || 'https://qa-conduit-api.bondaracademy.com/api';
  config.userEmail =
    process.env.USER_EMAIL || 'qa-pwapiuser@test.com';
  config.userPassword =
    process.env.USER_PASSWORD || 'qa-Welcome';
  config.authTokenBaseUrl =
    process.env.AUTH_TOKEN_BASE_URL || 'https://qa-dj4vuaaxgimt7erd.us.auth0.com/oaut2h/token';
  config.authAutoInsuranceBaseUrl =
    process.env.AUTO_INSURANCE_BASE_URL || 'https://qa-generalinsurance-ff4b.rest12db.io/rest';
}

if (env === 'prod') {
  config.apiUrl =
    process.env.API_URL || 'https://prod-conduit-api.bondaracademy.com/api';
  config.userEmail =
    process.env.USER_EMAIL || 'prod-pwapiuser@test.com';
  config.userPassword =
    process.env.USER_PASSWORD || 'prod-Welcome';
}

export { config };
