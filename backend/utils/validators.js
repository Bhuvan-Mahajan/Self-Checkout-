const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  phone: z
    .string({ error: 'Phone is required' })
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),

  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

module.exports = {
  registerSchema,
};
