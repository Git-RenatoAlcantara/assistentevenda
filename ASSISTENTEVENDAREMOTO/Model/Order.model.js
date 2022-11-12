class OrderModel {
  constructor({ productID, orderID, status, date }) {
    this.productID = productID;
    this.orderID = orderID;
    this.status = status;
    this.date = date;
  }
  
}

module.exports.OrderModel = OrderModel;
