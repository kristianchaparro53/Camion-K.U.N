const express = require("express");
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { google } = require('googleapis');
const crypto = require('crypto');
const axios = require('axios');
const enviarCorreoCodigo = require("../controllers/CorreoCodigo");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email'
];

// Ruta para iniciar la autenticación
router.get('/auth/google', (req, res) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Necesario si quieres tokens de actualización
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] // Los permisos que necesitas
    });
    res.redirect(authorizationUrl); // Redirige al usuario a Google para autenticarse
});


// Ruta de callback después de la autenticación
router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query; // El código de autorización devuelto por Google

    if (!code) {
        return res.status(400).send('No se recibió código de autorización.');
    }

    try {
        // Intercambia el código de autorización por tokens de acceso y actualización
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens); // Establece los tokens en el cliente OAuth

        // Ahora puedes usar el token de acceso para obtener datos del usuario
        const userInfoResponse = await oauth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });
        console.log(userInfoResponse.data.email)
        const email = userInfoResponse.data.email.trim();
        console.log(email)
        const user = await User.findOne({ email:email });
        console.log(user)
        req.session.usuario = {
            email: user.email
        };
        req.session.userPhoneNumber = user.phoneNumber;
        const codigoNuevo = Math.floor(1000 + Math.random() * 9000);
        const updateFields = { codigo: codigoNuevo };
        const userCambio = await User.findOneAndUpdate(
            { email: email },
            updateFields,
            { new: true, runValidators: true }
        );
        await enviarCorreoCodigo(user.email,codigoNuevo)
        req.flash('error', 'Verifica tu correo por tu codigo de acceso.');
        return res.redirect('/verificar');
    } catch (error) {
        console.error('Error durante la autenticación con Google:', error);
        req.flash('error', 'Error durante la autenticación con Google');
        return res.redirect('/login');
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session.usuario) {
        return next();
    } else {
        req.flash('error', 'Debes iniciar sesión para acceder.');
        return res.redirect('/');
    }
};

router.get('/', (req, res) => {
    try {
        const messages = req.flash('error');
        return res.render('index', { messages: messages });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Ocurrio un error en el servidor.');
        return res.render('index', { messages: messages });
    }

});

router.get('/register', (req, res) => {
    try {
        const messages = req.flash('error');
        return res.render('register', { messages: messages })
    } catch (error) {
        console.log(error);
        req.flash('error', 'Ocurrio un error en el servidor.');
        return res.render('index', { messages: messages });
    }

});

router.get('/login', (req, res) => {
    try {
        const messages = req.flash('error');
        return res.render('login', { messages: messages })
    } catch (error) {
        console.log(error);
        req.flash('error', 'Ocurrio un error en el servidor.');
        return res.render('index', { messages: messages });
    }
});

router.get('/verificar', isAuthenticated, (req, res) => {
    try {
        const correo = req.session.usuario.email;
        const messages = req.flash('error');
        return res.render('verificar', { messages: messages, correo: correo });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Ocurrio un error en el servidor.');
        return res.render('index', { messages: messages });
    }
});

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const correo = req.session.usuario.email;
        const user = await User.findOne({ email: correo });
        console.log(user)
        const messages = req.flash('error');
        return res.render('profile', { messages: messages, user });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Ocurrio un error en el servidor.');
        return res.render('index', { messages: messages });
    }
});
router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            req.flash('error', 'Error al cerrar la sesión.');
            return res.redirect('/profile');
        }
        res.redirect('/');
    });
});

module.exports = router;