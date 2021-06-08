const express = require('express');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('./helpers/nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json()); // cargar las cosas en el request body

app.post('/login',(req ,res ) => {
    const {email, password} = req.body;

    const user ={
        email:"lui123@hmail.com",
        password:"luis123",
    }
    
    try {
        if(email === user.email && password === user.password){
            let userDB = {
                id:1,
                firstname: "Luis",
                lastname:"Torres"
            };
            const token = jwt.sign(userDB,process.env.JWT_KEY, {algorithm:"HS512", expiresIn:"1h"});
            res.json({token});
        }    
    } catch (error) {
        res.status(500).json({message:"Hubo un problema en el servidor"});
    }

});


const verifyToken = ((req, res, next) => {
    const token = req.headers['access-token'];
    
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {      
            if (err) {
                return res.json({ mensaje: 'Token inválido' });    
            } else {
                req.decoded = decoded;    
                next();
            }
        });
    } else {
        res.send({ 
            mensaje: 'Token no proporcionado.' 
        });
    }
});

app.get("/actors",verifyToken, (req, res) => {
    res.json({message:"Tienes acceso a los recursos"});
});
app.post("/enviar-correo"), (req, res) =>  {
    const emailOptions = {
        subject: "Bienvenido a Nodemailer!",
        to: "the.polwe@gmail.com",
        from: process.env.GUSER,
        text: "Hola mundo ! Correo bien"
    }
    console.log(emailOptions);
    sendEmail(emailOptions);
};
app.listen(8000, () => {
    console.log("Servidor creado sobre el puerto 8000");
});