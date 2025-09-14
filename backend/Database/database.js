const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.mongoUrl;
let db;

const mongoConnect = async (callback) => {
    try {
        const connection = await mongoose.connect(MONGO_URL);
        db = connection.connection.db;
        console.log("✅ Connected to MongoDB!");
        callback();
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }
};

exports.mongoConnect = mongoConnect;