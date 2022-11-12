const moment = require("moment");
class EasyDate {
  #formatter;
  #date_now;
  #day;
  #month;
  #year;

  #time_now;
  #hour;
  #min;
  #seg;

  #formatted;

  constructor() {
    let date = new Date();
    this.#formatter = new Intl.DateTimeFormat([], {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long",
    });

    this.#date_now = this.#formatter.format(date).split(" ")[0];
    this.#day = this.#date_now.split("/")[0];
    this.#month = this.#date_now.split("/")[1];
    this.#year = this.#date_now.split("/")[2];

    this.#time_now = this.#formatter.format(date).split(" ")[1];
    this.#hour = this.#time_now.split(":")[0];
    this.#min = this.#time_now.split(":")[1];
    this.#seg = this.#time_now.split(":")[2];
  }

  get now() {
    return (
      this.#year +
      "-" +
      this.#month +
      "-" +
      this.#day +
      "T" +
      this.#hour +
      ":" +
      this.#min +
      ":" +
      this.#seg +
      ".000-4:00"
    );
  }

  get getYear() {
    return this.#year;
  }

  get getMonth() {
    return this.#month;
  }

  get getDay() {
    return this.#day;
  }

  get getHour() {
    return this.#hour;
  }

  get getMin() {
    return this.#min;
  }

  get getMonth() {
    return this.#month;
  }

  static different24 = function (before_date) {
    // input = '2022-10-08T3:59:16.000-4:00'

    // Formata : '2022-10-08 3:59:16.000-4:00'
    const before_date_formatted = before_date.replace("T", " ");
    const before_date_moment = moment(
      before_date_formatted,
      "YYYY-M-DD HH:mm:ss"
    );

    // Obtem a diferança da data anterior com a data atual
    const date_now = moment();
    const diff = date_now.diff(before_date_moment);

    // Formata a data para o formato horas
    return parseInt(diff) > 86400000;
  };
}

module.exports.EasyDate = EasyDate;
