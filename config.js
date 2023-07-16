require('dotenv').config();

module.exports = {
   PORT: process.env.PORT,
   DB_HOST: process.env.DB_HOST,
   DB_USER: process.env.DB_USER,
   DB_PASSWORD: process.env.DB_PASSWORD,
   DB_PORT: process.env.DB_PORT,
   DB_NAME: 'chatappDB',
   MESSAGING_EMAIL: process.env.MESSAGING_EMAIL,
   MESSAGING_EMAIL_PASSWORD: process.env.MESSAGING_EMAIL_PASSWORD
};