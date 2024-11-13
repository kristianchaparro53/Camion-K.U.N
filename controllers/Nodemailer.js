const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();
// Configurar el transporte SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para SSL
    auth: {
        user: process.env.NodeMailerCorreo,
        pass: process.env.NodeMailerPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;