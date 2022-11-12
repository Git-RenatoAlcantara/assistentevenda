const { config } = require("dotenv");
const axios = require("axios");

config();

async function mercadopago(client) {
    const { MP } = process.env;
  return axios.post("https://api.mercadopago.com/v1/payments", client, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${MP}`,
    },
  });
}

module.exports.pix = (client)  => {
 
  return new Promise((resolve, reject) => {
    mercadopago(client)
      .then((response) => {
        const qrcode =
          response.data.point_of_interaction.transaction_data.qr_code;
        const id = response.data.id;
        resolve({ qrcode, id });
      })
      .catch((error) => {
        reject(error);
      });
  });

}
