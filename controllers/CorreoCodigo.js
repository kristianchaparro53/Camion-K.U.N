const nodemailer = require('nodemailer');
const transporter = require('./Nodemailer');
const dotenv = require("dotenv");

dotenv.config();

async function enviarCorreoCodigo(correo, codigo) {
    try {
        // Configurar el contenido del correo electrónico
        const mailOptions = {
            from: process.env.NodeMailerCorreo,
            to: correo,
            subject: 'Código de acceso',
            text: `Su código de acceso es: ${codigo}`
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
}

module.exports = enviarCorreoCodigo;