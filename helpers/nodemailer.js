const nodemailer = require("nodemailer");
const googleAPIS = require("googleapis");

const Oauth2 = googleAPIS.google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2( // el cliebte de Oauth sirve para generear el Token de acceso
      process.env.GCLIENT_ID,
      process.env.GCLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
  
    oauth2Client.setCredentials({
      refresh_token: process.env.GREFRESH_TOKEN
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GUSER,
        accessToken,
        clientId: process.env.GCLIENT_ID,
        clientSecret: process.env.GCLIENT_SECRET,
        refreshToken: process.env.GREFRESH_TOKEN
      }
    });
  
    return transporter;
  };

  const sendEmail = async (options) => { // en este options van los datos más importates 
    try {
        gTransporter = await createTransporter();
        const results = await gTransporter.sendEmail(); // 44:00
        console.log(results);
    } catch (error) {
        console.log(error);
    }
  }

  module.exports = {sendEmail};