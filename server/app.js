const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const httpStatus = require("http-status");
const { mongoURI } = require("./config");
const otherHelper = require("./helper/responseHelper");
const apiRoutes = require("./routes/index");
const passport = require("./middleware/passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

//enable cors
app.use(
  cors({
    origin: "*",
    // credentials: true, //access-control-allow-credentials:true
    // optionSuccessStatus: 200,
  })
);
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Headers, *, Access-Control-Allow-Origin",
//     "Origin, X-Requested-with, Content_Type,Accept,Authorization",
//     "http://stage.mengedegna.com/"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(passport.initialize());

// Logger middleware
app.use(logger("dev"));

// create application/json parser
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

// create application/x-www-form-urlencoded parser
// app.use(
//   bodyParser.urlencoded({
//     limit: '50mb',
//     extended: false,
//   }),
// );
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ type: "text/*" }));

// swagger implementation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//db config
mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
  console.log("Connection Established");
});
mongoose.connection.on("disconnected", () => {
  console.log("Connection   ");
});
mongoose.connection.on("close", () => {
  console.log("Connection Closed");
});
mongoose.connection.on("error", (error) => {
  console.log("ERROR: " + error);
});

const connectDB = async (app) => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("Db connected");

    return app;
  } catch (err) {
    console.log("DB error: ", err);
  }
};

connectDB(app);

//enable image file to preview
app.use("/public", express.static(path.join(__dirname, "public")));

//Use Routes
if (process.env.APP_ENV === "development") {
  app.use("/api/v1", apiRoutes());
} else {
  app.use("/v1", apiRoutes());
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Requested Resource Is Not Available" });
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return otherHelper.sendResponse(
      res,
      httpStatus.NOT_FOUND,
      false,
      null,
      null,
      "Route Not Found",
      null
    );
  } else {
    console.log("\x1b[41m", err);
    // AddErrorToLogs(req, res, next, err);
    return otherHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      null,
      null,
      null,
      null
    );
  }
});

console.log("MENGEDEGNA TICKET API functioning...");

module.exports = app;
