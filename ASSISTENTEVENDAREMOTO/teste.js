const path = require("path");
const fs = require("fs");

async function openAccountsConfig() {
  const configPath = path.join(__dirname, "Config", "products.json");
  const jsonOject = fs.readFileSync(configPath, { encoding: "utf-8" });
  return JSON.parse(jsonOject).premium;
}

(async () => {
  const result = await openAccountsConfig();
  const product = result.find((find) => find.id == "SSH01");
  console.log(product.validade);
})();
