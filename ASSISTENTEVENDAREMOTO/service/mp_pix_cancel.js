const axios = require("axios");

module.exports = async function mpPixCancel(order_id) {
  return new Promise((resolve, reject) => {
    const { MP } = process.env;
    let time = Date.now().toString();
    axios({
      method: "PUT",
      url: `https://api.mercadopago.com/v1/payments/${order_id}`,
      data: {
        status: "cancelled",
      },
      headers: {
        Authorization: `Bearer ${MP}`,
        timestamp: time,
      },
    })
      .then((response) => resolve(response.data.status))
      .catch((error) => reject(error));
  });
};
