const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

DB_MONGO = process.env.CONNECTION;
const connectDb = async () => {
  try {
    await mongoose.connect(DB_MONGO);
    console.log("Base de Datos Conectada");
  } catch (error) {
    console.log(error);
    console.log("BackEnd detenido");
    process.exit(1);
  }
};

module.exports = connectDb;