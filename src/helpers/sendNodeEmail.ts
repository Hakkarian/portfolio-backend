import nodemailer from 'nodemailer';

export const emailKey = process.env.META_PASSWORD;

const nodemailerConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: 'theobadar@meta.ua',
        pass: emailKey
    },
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendNodeEmail = async (data: any) => {
  await transport
    .sendMail({ ...data, from: "theobadar@meta.ua" })
    .then(() => console.log("Success nodemail"))
        .catch((error) => console.log("email", error.message));
    return true;
};

export default sendNodeEmail;