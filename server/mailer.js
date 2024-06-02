const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // ou autre service d'email comme 'Yahoo', 'Outlook', etc.
    auth: {
        user: 'quizz.ussi0s@gmail.com',
        pass: 'zevp hutj yixc irln'
    }
});

// Vérifier la configuration du transporteur
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Mail server is ready to take our messages');
    }
});

module.exports = transporter;