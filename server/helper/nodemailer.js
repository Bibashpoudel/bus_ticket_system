const nodemailer = require("nodemailer");
const {
  sendSignUpCode,
  sendPassword,
  sendTicket,
  uploadReceipt,
  sendCancelMessage,
  sendContactUsMessage,
  sendForgotPasswordOtp,
} = require("./nodemailerHelper");
const emailSettingSch = require("../modules/emailSetting/emailSettingSchema");
module.exports = {
  nodemailer: async (requirements, forWhat, res) => {
    try {
      const emailSetting = await emailSettingSch.findOne({});
      const transporter = await nodemailer.createTransport({
        service: emailSetting.service,
        host: emailSetting.host,
        port: emailSetting.port,
        auth: {
          user: emailSetting.account,
          pass: emailSetting.password,
        },
      });

      // const transporter = await nodemailer.createTransport({
      //   service: process.env.MAIL_SERVICE,
      //   host: process.env.MAIL_HOST,
      //   port: process.env.MAIL_PORT,
      //   auth: {
      //     user: process.env.MAIL_ACCOUNT,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // });

      switch (forWhat) {
        case "sendCode":
          return await sendSignUpCode(requirements, transporter, res);
        case "forgotPassword":
          return await sendForgotPasswordOtp(requirements, transporter, res);
        case "sendPassword":
          return await sendPassword(requirements, transporter, res);
        case "sendTicket":
          return await sendTicket(requirements, transporter, res);
        case "uploadReceipt":
          return await uploadReceipt(requirements, transporter, res);
        case "sendCancelMessage":
          return await sendCancelMessage(requirements, transporter, res);
        case "contactUs_Message":
          return await sendContactUsMessage(requirements, transporter, res);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
