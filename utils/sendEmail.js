const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = async (email, subject, text) => {
   try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: 'rksjautonotification1509@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
         }

      });

      const mailOptions = {
         from: 'rksjautonotification1509@gmail.com',
         to: email,
         subject: subject,
         text: text
      };

      await transport.sendMail(mailOptions);

      console.log("email sent successfully!");

   } catch (error) {
      console.log("email not sent");
      console.log(error);
      return error;
   }
}