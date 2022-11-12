const ms = require("ms");
const moment = require("moment");

class ExpiratioDate {
  #ms;
  constructor() {
    this.#ms = ms("6m");
  }
  get date() {
    const pixExpirationMinutes = Math.trunc(this.#ms / 60000) % 60;
    moment.locale("America/Los_Angeles");

    let pixExpiration = moment();
    pixExpiration
      .add(pixExpirationMinutes, "minutes")
      .format("YYYY-MM-DDThh:mm:ssZ");

    return pixExpiration.format();
  }

  static initialize() {
    const instance = new ExpiratioDate();
    return instance;
  }
  get minutes() {
    return Math.trunc(this.#ms / 60000) % 60;
  }
}

module.exports = ExpiratioDate;
