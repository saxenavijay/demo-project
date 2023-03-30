// /* const nodemailer = require("nodemailer");

// const sendEmail = (options) => {
//   const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: options.to,
//     subject: options.subject,
//     html: options.text,
//   };

//   transporter.sendMail(mailOptions, function (err, info) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(info);
//     }
//   });
// };

// module.exports = sendEmail; */


// const nodemailer = require("nodemailer");
// const Mailgen = require("mailgen");
// //const { email, password, main_url,logo }  = require("../config/email.config.js");

//   const mail = {

//   };

//   mail.generator = new Mailgen({
//     theme: "default",
//     product: {
//       name: process.env.SITE_NAME,
//       link: process.env.SITE_URL,
//       copyright: 'Copyright © 2021 Radhe Solution. All rights reserved.',
//       logo:process.env.SITE_LOGO,
//       logoHeight: '30px'
//     },
//   });


//   mail.send = async function sendEmail(to,subject,html,account) {

//     return new Promise(async (resolve,reject)=>{

//     //const key = require("./jto-email");

//     let mailBody = mail.generator.generate({body:html});

//     var mailAccounts = [
//       {
//         //orders
//         service:process.env.EMAIL_SERVICE,
//         host:process.env.EMAIL_HOST,
//         user:process.env.EMAIL_USERNAME,
//         pass:process.env.EMAIL_PASSWORD,
//         from:process.env.EMAIL_FROM,
//         port:process.env.EMAIL_PORT
//       },
//       {
//         //noreply
//         service:process.env.EMAIL_SERVICE2,
//         host:process.env.EMAIL_HOST2,
//         user:process.env.EMAIL_USERNAME2,
//         pass:process.env.EMAIL_PASSWORD2,
//         from:process.env.EMAIL_FROM2,
//         port:process.env.EMAIL_PORT
//       },
//       {
//         //comket
//         service:process.env.EMAIL_SERVICE3,
//         host:process.env.EMAIL_HOST3,
//         user:process.env.EMAIL_USERNAME3,
//         pass:process.env.EMAIL_PASSWORD3,
//         from:process.env.EMAIL_FROM3,
//         port:process.env.EMAIL_PORT
//       }
//     ];

//     console.log("send email from - "+mailAccounts[account].from);

//     let message = {
//         from: mailAccounts[account].from,//process.env.EMAIL_FROM,
//         to: to,
//         subject: subject,
//         html: mailBody
//       };

//       mail.transporter = nodemailer.createTransport({
//         //service: mailAccounts[account].service,
//         host: 'mail.digibulkmarketing.com',//mailAccounts[account].host,
//         port: 465,
//         secure:true,
//         auth: {
//           // type:'Oauth2',
//            user:'info@digibulkmarketing.com',//mailAccounts[account].user,
//           // serviceClient:key.client_id,
//           // privateKey:key.private_key
//           pass:'V!DigiBulkMark76$#'//mailAccounts[account].pass
//         },
//       });

//     //await mail.transporter.verify();

//     mail.transporter
//     .sendMail(message, function(error, info){
//         if (error) {
//             console.log("Email error is "+error);
//            resolve(false); // or use rejcet(false) but then you will have to handle errors
//         } 
//        else {
//            console.log('Email sent: ' + info.response);
//            resolve(true);
//         }
//        });

// });

//   }


//   module.exports = mail;
