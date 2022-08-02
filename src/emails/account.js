const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox5285d40606b34fc5a1897bea0cc52388.mailgun.org';
const mg = mailgun({apiKey: process.env.SENDMAILGUN_API_KEY,domain:DOMAIN});
// const data = {
// 	from: 'nangiabusiness2001@gmail.com',
// 	to: 'vaibhavnangia2001@gmail.com',
// 	subject: 'Hello',
// 	text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });

const sendWelcomeEmail = (email,name)=>{
	mg.messages().send({
        from: 'nangiabusiness2001@gmail.com',
        to: email,
        subject: 'Thanks for joining',
        text: `Welcome to the app, ${name} Hope you enjoy`
    })
};

const sendCancelEmail = (email,name)=>{
	mg.messages().send({
        from: 'nangiabusiness2001@gmail.com',
        to: email,
        subject: 'Sorry to see you go',
        text: `We  will miss you, ${name} See you soon`
    })
};
module.exports={
    sendWelcomeEmail,sendCancelEmail
}