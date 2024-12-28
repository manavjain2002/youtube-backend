import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT;
export const dbUrl = process.env.DB_URI;
