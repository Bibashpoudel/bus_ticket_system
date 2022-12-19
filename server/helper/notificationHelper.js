const admin = require("firebase-admin");
const serviceAccount = require("../fcmKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (registrationToken, message) => {
  const { failureCount, successCount } = await admin
    .messaging()
    .sendToDevice(registrationToken, message, { priority: "high" });
  console.log("failure", failureCount, "successCount", successCount);
};

module.exports = sendNotification;
