 /* eslint-disable prettier/prettier */
 
 // mail.service.ts
import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  private readonly mg;

  constructor() {
    this.mg = mailgun({
      apiKey:(process.env.MAILGUN_API_KEY),
      domain: 'your-mailgun-domain',
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const data = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      
    };

    try {
      await this.mg.messages().send(data);
      console.log(`Email sent to ${to} successfully`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import * as sgMail from '@sendgrid/mail';

// @Injectable()
// export class EmailService {
//   constructor() {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   }

//   async sendEmail(to: string, subject: string, text: string): Promise<void> {
//     const msg = {
//       to,
//       from: process.env.EMAIL_FROM, // Set your sender email address here
//       subject,
//       text,
//     };

//     try {
//       await sgMail.send(msg);
//       console.log('Email sent successfully.');
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   }
// }

// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {
//   private readonly transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });
      
//   }

//   async sendEmail(to: string, subject: string, text: string): Promise<void> {
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to,
//       subject,
//       text,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log('Email sent successfully.');
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   }
// }
