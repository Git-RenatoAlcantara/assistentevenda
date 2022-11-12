const logger = require("../Log/logger");
const path = require('path')
const moment = require("moment");

const {
  TWABotFileExist,
  TWABoWriteFile,
  TWABotOpenFile
} = require("../Util/TBotZapData");
const { EasyDate } = require("../Util/EasyDate");

saveOrder = ( orderId, chatId, id ) => {
  return new Promise((resolve, reject) => {
    const easydate = new EasyDate()

    var newOrder = {
      order_id: orderId,
      chat_id: chatId,
      status: "pending",
      date: easydate.now,
      id: id
    };
    orders = path.join(__dirname, "..", "Database", "order.pending.json");

    if (TWABotFileExist({ path: orders })) {
      try {
        
        const order_file = TWABotOpenFile({ path: orders });
        if (order_file.length > 0) {
          const order_json = JSON.parse(order_file);
          order_json.push(newOrder);
          if (TWABoWriteFile({ path: orders, file: order_json })) {
            resolve({ status: true });
          } else {
            resolve({ status: false });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const order_list = [];
      order_list.push(newOrder);

      if (
        TWABoWriteFile({
          path: orders,
          file: order_list,
        })
      ) {
        resolve({ status: true });
      } else {
        resolve({ status: false });
      }
    }
  });
};

module.exports = saveOrder