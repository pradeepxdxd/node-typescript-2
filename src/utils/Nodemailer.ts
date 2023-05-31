import * as nodemailer from "nodemailer";
import { getEnvironmentVariable } from "../environments/env";

export class NodeMailer {
  public static transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: getEnvironmentVariable().email, // generated ethereal user
      pass: getEnvironmentVariable().password, // generated ethereal password
    },
  });
}
