const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const enviarCorreoCodigo = require('../controllers/CorreoCodigo')

module.exports.loginFun = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailMin = email.toLowerCase();
        const user = await User.findOne({ email:emailMin });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.usuario = {
                email: user.email
            };
            req.session.userPhoneNumber = user.phoneNumber;
            const codigoNuevo = Math.floor(1000 + Math.random() * 9000);
            const updateFields = { codigo: codigoNuevo };
            const userCambio = await User.findOneAndUpdate(
                { email: emailMin },
                updateFields,
                { new: true, runValidators: true }
            );
            await enviarCorreoCodigo(user.email,codigoNuevo)
            req.flash('error', 'Verifica tu correo por tu codigo de acceso.');
            return res.redirect('/verificar');
        } else {
            req.flash('error', 'El correo no existe o la contraseña es incorrecta.');
            return res.redirect('/login');
        }

    } catch (error) {
        // Manejo de errores
        return res.json({ message: error.message });
    }
};
module.exports.codigoVerificacion = async (req, res) => {
    try {
        const { code, correo } = req.body;
        const user = await User.findOne({ email:correo });

        // Verificamos si el código ingresado es válido
        if (code == user.codigo) {
            return res.redirect('/profile');
        } else {
            req.flash('error', 'El codigo es incorrecto.');
            return res.redirect('/verificar');
        }
        
    } catch (error) {
        return res.json({ message: error.message });
    }
}

module.exports.registroUsuario = async (req, res) => {
    try {
        const { firstName, lastName, email, password, shift, busNumber, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailMin = email.toLowerCase(); 
        await User.create({ firstName, lastName, email:emailMin, password: hashedPassword, shift, busNumber, phoneNumber });
        req.flash('error', 'Ya puede iniciar sesión.');
        return res.redirect('/login');
    } catch (error) {
        return res.json({ message: error.message });
    }
}