const envOrigins = process.env.ALLOWED_ORIGINS

export const allowedOrigins = envOrigins.split(' ');
