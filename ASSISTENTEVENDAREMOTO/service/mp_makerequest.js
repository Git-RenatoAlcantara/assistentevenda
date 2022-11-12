const axios = require("axios");

module.exports = async function makeRequest(order_id) {
  return new Promise((resolve, reject) => {
    const { MP } = process.env;
    let time = Date.now().toString();
    axios({
      method: "GET",
      url: `https://api.mercadopago.com/v1/payments/${order_id}`,
      headers: {
        Authorization: `Bearer ${MP}`,
        timestamp: time,
      },
    })
      .then((response) => resolve(response.data.status))
      .catch((error) => reject(error));
  });
};
