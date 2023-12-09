import nodemailer from 'nodemailer';

export const emailKey = process.env.META_PASSWORD;

// handles email transfer

const nodemailerConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: 'theobadar@meta.ua',
        pass: emailKey
    },
}

// creates transport, by which some information will be transferred

const transport = nodemailer.createTransport(nodemailerConfig);

const sendNodeEmail = async (data: any) => {
  await transport
    .sendMail({ ...data, from: "theobadar@meta.ua" })
      .then(() => console.log("Success nodemail"))
      // if data is not transferred correctly, throw an error
        .catch((error) => console.log("email", error.message));
    // else exit the operation
    return true;
};

export default sendNodeEmail;