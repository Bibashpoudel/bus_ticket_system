const moment = require("moment");

module.exports = {
  getTimeFormatter(time) {
    const split = time.split(":");
    const engHour = parseInt(split[0]);
    if (engHour <= 6) {
      return `${moment(time, "hh:mm").format("hh:mm A")} (${engHour + 6}:${
        split[1]
      })`;
    } else if (engHour > 6 && engHour <= 18) {
      return `${moment(time, "hh:mm").format("hh:mm A")} (${engHour - 6}:${
        split[1]
      })`;
    } //engHour >= 19 and engHour < = 23
    else {
      return `${moment(time, "hh:mm").format("hh:mm A")} (${engHour - 18}:${
        split[1]
      })`;
    }
  },
};
