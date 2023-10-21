import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.GOOGLE_EMAIL}`,
    pass: `${process.env.GOOGLE_PASSWORD}`,
  },
});

const defaultMailOptions = {
  from: `${process.env.GOOGLE_EMAIL}`,
  to: `${process.env.GOOGLE_EMAIL}`,
  subject: "Polish residence card info",
  text: "Check, there's available time!",
};

export const sendEmail = async (mailOptions = defaultMailOptions) => {
  const info = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return info;
};
