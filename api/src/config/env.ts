import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined, see .env.example`);
  }
  return value;
};

export const env = {
  port: Number(process.env['PORT'] ?? 3000),
  databaseUrl: required('DATABASE_URL'),
  isProd: process.env['NODE_ENV'] === 'production',
  jwtSecret: required('JWT_SECRET'),
  apiPublicPath: (process.env['API_PUBLIC_PATH'] ?? '/api').replace(/\/$/, ''),
  accessTokenTtl: 15 * 60, // 15 minutes
  refreshTokenTtl: 7 * 24 * 60 * 60, // 7 days
};
