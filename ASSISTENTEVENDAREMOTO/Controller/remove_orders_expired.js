const path = require("path");
const { readFile, writeFile } = require("fs/promises");
const { EasyDate } = require("../Util/EasyDate");
const mp_makerequest = require("../service/mp_makerequest");

const findItemIndexAndDelSymbol = Symbol("findItemIndex");
class OrdersExpired {
  static update = async function (item) {
    const isPaid = await mp_makerequest(item.order_id);
    if (isPaid) {
      await this[findItemIndexAndDelSymbol](item.order_id);
      return;
    }
    return;
  };

  static [findItemIndexAndDelSymbol] = async (order_id) => {
    const fileContent = await readFile(
      path.join(__dirname, "..", "Database", "order.pending.json"),
      "utf-8"
    );
    const convertFileContent = JSON.parse(fileContent);
    const index = convertFileContent.findIndex((element, index) => {
      return element.order_id == order_id;
    });

    convertFileContent.splice(parseInt(index), 1);
    await writeFile(
      path.join(__dirname, "..", "Database", "order.pending.json"),
      JSON.stringify(convertFileContent, null, 4)
    );
  };
}

module.exports.OrdersExpired = OrdersExpired;
