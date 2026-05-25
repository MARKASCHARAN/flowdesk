import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const envSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(4000),
  DATABASE_URL: joi.string().required(),
  REDIS_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().default('1d'),
  AWS_REGION: joi.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: joi.string().optional(),
  S3_BUCKET_NAME: joi.string().optional(),
  LOG_LEVEL: joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DATABASE_URL,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  aws: {
    region: envVars.AWS_REGION,
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    s3Bucket: envVars.S3_BUCKET_NAME,
  },
  logger: {
    level: envVars.LOG_LEVEL,
  }
};
