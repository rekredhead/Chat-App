const nodemailer = require('nodemailer');
const { MESSAGING_EMAIL, MESSAGING_EMAIL_PASSWORD } = require('../../config');

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: MESSAGING_EMAIL,
      pass: MESSAGING_EMAIL_PASSWORD
   }
});

const getMessageBody = (verificationCode) => {
   return `<h2>Here is your verification code for password resetting</h2>
      <p>Verification Code: ${verificationCode}</p>`;
}

const isVerificationEmailSent = (userEmail, verificationCode) => {
   const mailOptions = {
      from: MESSAGING_EMAIL,
      to: userEmail,
      subject: 'Rekredhead ChatApp Verification Code',
      html: getMessageBody(verificationCode)
   };

   try {
      transporter.sendMail(mailOptions);
      return true;
   } catch (err) {
      console.log(err);
      return false;
   }
}

module.exports = isVerificationEmailSent;