const moment = require("moment");
/*
const date_now = moment()

var startDate = moment('2022-10-01 20:18:00', 'YYYY-M-DD HH:mm:ss')
var endDate = moment('2022-10-01 21:18:00', 'YYYY-M-DD HH:mm:ss')
console.log(startDate)
console.log(endDate)
//var secondsDiff = endDate.diff(startDate, 'seconds')
const day = date_now.get("date")
const month = date_now.get("month")
const year  = date_now.get("year")

*/
const date_now = moment().format();
const date = date_now.split("T")[0];
const time = date_now.split("T")[1].split("-")[0];
const [ hour, minute, seconds] = time.split(':')
const [ year, month, day] = date.split("-")
console.log(moment().add(30, 'days').format('DD-M-YYYY'))