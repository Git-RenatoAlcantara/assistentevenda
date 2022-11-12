const Service = require("./DatabasePendingToApproved.controller");

module.exports.update = update = () => {
  const service = new Service();
  Promise.resolve(
    setInterval(() => {
      service.checkOrderStatusOnMercadoPago();
    }, 10000)
  );
};
