const { readFile, writeFile, stat } = require("fs/promises");
const { config } = require("dotenv");
const fs = require("fs");
const path = require("path");
const { OrdersExpired } = require("./remove_orders_expired");
const mp_makerequest = require("../service/mp_makerequest");
config();

class Service {
  #orders_pending = path.join(
    __dirname,
    "..",
    "Database",
    "order.pending.json"
  );
  #orders_approved = path.join(
    __dirname,
    "..",
    "Database",
    "order.approved.json"
  );

  async findItemIndex(item, pathContent) {
    const fileContent = await this.getFileContent(pathContent);
    const convertFileContent = JSON.parse(fileContent);
    return convertFileContent.findIndex((element, index) => {
      return element.order_id == item.order_id;
    });
  }
  async deleteAllOrdersThatSatusChangeOfPendingToApproved(
    pathContent,
    orderToRemove
  ) {
    const fileContent = await this.getFileContent(pathContent);
    const fileContentList = JSON.parse(fileContent);
    let orderPendingUpdate;
    for (var order of orderToRemove) {
      const index = await this.findItemIndex(order, pathContent);
      fileContentList.splice(parseInt(index), 1);
    }

    try {
      await writeFile(pathContent, JSON.stringify(fileContentList, null, 4));
    } catch (error) {
      console.log(error);
    }
  }
  async checkOrderStatusOnMercadoPago() {
    const ordersFileContent = await this.getOrdersPendingInDatabase();
    if (ordersFileContent == undefined) return;
    const ordersListIsEmpty = ordersFileContent.length > 0;
    if (ordersListIsEmpty) {
      const approved_list = await ordersFileContent.reduce(
        async (list, item, index) => {
          const request = await mp_makerequest(item.order_id);
          const approved_list = await list;
          if (approved_list != undefined) {
            if (request.includes("approved")) {
              approved_list.push(item);
            }
            if (request.includes("cancelled")) {
              await OrdersExpired.update(item);
            }
          }
          return approved_list;
        },
        []
      );

      if (approved_list.length > 0) {
        await this.deleteAllOrdersThatSatusChangeOfPendingToApproved(
          this.#orders_pending,
          approved_list
        );
        await this.saveOrderWithStatusApprovedToSend(approved_list);
      }
    }
  }

  async getFileContent(filePath) {
    try {
      return (await readFile(filePath)).toString("utf-8");
    } catch (error) {
      console.log(error);
    }
  }
  async saveOrderWithStatusApprovedToSend(list_approved) {
    const approvedFileExistis = stat(this.#orders_approved);
    if (approvedFileExistis) {
      const approved_file = await this.getFileContent(this.#orders_approved);
      const approvedFileToList = JSON.parse(approved_file);
      if (approvedFileToList == undefined) {
        await writeFile(
          this.#orders_approved,
          JSON.stringify(list_approved, null, 4)
        );
        return;
      }
      const updateApproveList = approvedFileToList.concat(list_approved);
      await writeFile(
        this.#orders_approved,
        JSON.stringify(updateApproveList, null, 4)
      );
      return;
    }
  }

  async getOrdersPendingInDatabase() {
    if (!stat(this.#orders_pending)) return;
    const orders_pending_string = await this.getFileContent(
      this.#orders_pending
    );
    if (orders_pending_string.length <= 0) return;
    const orders_pending_list = JSON.parse(orders_pending_string);

    return orders_pending_list.reduce((array, item) => {
      const pending = item.status == "pending";
      if (pending)
        array.push({
          chat_id: item.chat_id,
          order_id: item.order_id,
          date: item.date,
          item: item.id,
        });
      return array;
    }, []);
  }
}

module.exports = Service;
