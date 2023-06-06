import dotenv from "dotenv";
dotenv.config({
  path: "../src/.env",
});

export const urlMongoDB = process.env.URLMONGODB;
export const database_type = process.env.DATABASE_TYPE || "MONGO" 
export const smtp_port = process.env.SMTP_PORT;
export const admin_email = process.env.ADMIN_EMAIL;
export const admin_password = process.env.ADMIN_PASSWORD;
export const accountSID = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN;
export const session_key = process.env.SESSIONKEY;
export const JWT_secret_key = process.env.JWT_SECRET;