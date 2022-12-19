const ejs = require("ejs");
const emailSettingSchema = require("../modules/emailSetting/emailSettingSchema");

module.exports = {
  sendSignUpCode: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const SENDER = emailSetting.sender;
      const MAIL_FROM = emailSetting.account;
      const data = await ejs.renderFile("./public/ejs/sendSignupCode.ejs", {
        name: requirements.user.firstname,
        email: requirements.user.email,
        user_id: requirements.user._id,
        code: requirements.otp_code,
        role: requirements.user.role,
        type: requirements.type,
      });

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" <${SENDER}>`,
          to: requirements.user.email,
          subject: "Sign Up Code",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("OTP sent to the authorizedd user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },

  sendPassword: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;
      const data = await ejs.renderFile("./public/ejs/sendPassword.ejs", {
        name: requirements.user.firstname,
        email: requirements.user.email,
        password: requirements.password,
        contactName: requirements.contactName,
        role: requirements.user.role,
      });

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" "<${SENDER}>" `,
          to: requirements.user.email,
          subject: "New account information",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("Password sent to the authorizedd user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },

  sendForgotPasswordOtp: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;
      const data = await ejs.renderFile(
        "./public/ejs/sendForgetPasswordCode.ejs",
        {
          name: requirements.user.firstname,
          email: requirements.user.email,
          code: requirements.otp_code,
          role: requirements.user.role,
          user_id: requirements.user._id,
        }
      );

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" "<${SENDER}>" `,
          to: requirements.user.email,
          subject: "Forgot Password Code",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("OTP sent to the authorizedd user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },

  sendTicket: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;

      const data = await ejs.renderFile("./public/ejs/sendTicket.ejs", {
        _id: requirements.createTicket._id,
        qrtext: requirements.createTicket.read_ticket_id,
        email: requirements.email,
        phone: requirements.phone,
        firstname: requirements.firstname,
        lastname: requirements.lastname,
        busPosition: requirements.busPosition,
        bus_details: requirements.bus_details,
        date: requirements.date,
        amount: requirements.amount,
        to: requirements.to,
        from: requirements.from,
        departure: requirements.departure,
        arrival: requirements.arrival,
        bus_name: requirements.bus_name,
        bus_plate_number: requirements.bus_plate_number,
        payment_type: requirements.payment_type,
      });

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" <${SENDER}>`,

          to: requirements.email,
          subject: "Your bus ticket",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("Ticket sent to the authorized user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },
  sendCancelMessage: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;
      const data = await ejs.renderFile("./public/ejs/cancleBooking.ejs", {
        email: requirements.email,
        phone: requirements.phone,
        firstname: requirements.firstname,
        lastname: requirements.lastname,
        busPosition: requirements.busPosition,
        bus_details: requirements.bus_details,
        date: requirements.date,
        amount: requirements.amount,
        to: requirements.to,
        from: requirements.from,
        departure: requirements.departure,
        arrival: requirements.arrival,
        bus_name: requirements.bus_name,
        bus_plate_number: requirements.bus_plate_number,
        payment_type: requirements.payment_type,
        message: requirements.message,
      });

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" <${SENDER}>`,

          to: requirements.email,
          subject: "Booking cancel",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("Ticket sent to the authorized user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },

  uploadReceipt: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;
      const data = await ejs.renderFile("./public/ejs/paymentReceipt.ejs", {
        ticket_id: requirements.createTicket._id,
      });

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" <${SENDER}>`,

          to: requirements.email,
          subject: "Send reference link",
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("Ticket sent to the authorized user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },
  sendContactUsMessage: async (requirements, transporter, res) => {
    try {
      const emailSetting = await emailSettingSchema.findOne({});
      const FROM_NAME = emailSetting.name;
      const MAIL_FROM = emailSetting.account;
      const SENDER = emailSetting.sender;
      const data = await ejs.renderFile(
        "./public/ejs/emailContactUsMessage.ejs",
        {
          fullname: requirements.fullname,
          message: requirements.message,
          email: requirements.email,
        }
      );

      if (data) {
        const mainOptions = {
          from: `"${FROM_NAME}" <${SENDER}>`,
          to: "support@mengedegna.com",
          subject: requirements.subject,
          html: data,
        };
        await transporter.sendMail(mainOptions);
        console.log("Email sent to the authorized user");
        return 0;
      } else {
        console.log("ejsFunction error");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
