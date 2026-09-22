require('dotenv').config();

const { z } = require('zod');

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z
    .string({ error: 'MONGO_URI is required' })
    .min(1, 'MONGO_URI is required'),

  JWT_SECRET: z
    .string({ error: 'JWT_SECRET is required' })
    .min(32, 'JWT_SECRET must be at least 32 characters'),

  JWT_REFRESH_SECRET: z
    .string({ error: 'JWT_REFRESH_SECRET is required' })
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),

  RAZORPAY_KEY_ID: z
    .string({ error: 'RAZORPAY_KEY_ID is required' })
    .min(1, 'RAZORPAY_KEY_ID is required'),

  RAZORPAY_KEY_SECRET: z
    .string({ error: 'RAZORPAY_KEY_SECRET is required' })
    .min(1, 'RAZORPAY_KEY_SECRET is required'),

  CLIENT_URL: z
    .string({ error: 'CLIENT_URL is required' })
    .url('CLIENT_URL must be a valid URL'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\n❌ Invalid environment variables:\n');

  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '(root)';
    console.error(`  • ${key}: ${issue.message}`);
  }

  console.error('\nFix your .env file and restart the server.\n');
  process.exit(1);
}

/** @type {z.infer<typeof envSchema>} */
const env = result.data;

module.exports = env;
