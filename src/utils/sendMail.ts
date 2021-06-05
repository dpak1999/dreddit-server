/** @format */

import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "vvqtwfdejwwixofz@ethereal.email",
      pass: "SAU2YfYWaRj9FMcG5c",
    },
  });

  let info = await transporter.sendMail({
    from: "Dreddit <no-reply.dred@node.com",
    to: to,
    subject: "Reset your password",
    html: html,
  });

  console.log("Message sent: ", info.messageId);
  console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
}
