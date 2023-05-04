import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
})

export const urlMongoDB = process.env.URLMONGODB;
export const database_type = process.env.DATABASE_TYPE || "MONGO" 