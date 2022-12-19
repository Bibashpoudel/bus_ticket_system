module.exports = {
  mongoURI: process.env.WR_DB_URI,

  // secretOrKey: process.env.SECRET,
  adminsecretOrKey: process.env.ADMIN_SECRET,

  secretOrKey: process.env.SECRET,

  googleSecretKey: process.env.GOOGLE_SECRET_KEY,

  clientAuth: process.env.CLIENT_TOKEN,

  /* paypal configs */
  paypalSecretKey: process.env.PAYPAL_SECRET_KEY,
  paypalBaseUrl: process.env.PAYPAL_API_BASE_URL,
  APPID: process.env.APPID,
  APPKEY: process.env.APPKEY,
  PUBLICKEY: process.env.PUBLICKEY,
};
