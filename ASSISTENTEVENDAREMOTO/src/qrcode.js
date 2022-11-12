const { Client, LocalAuth } = require("whatsapp-web.js");
const logger = require("../Log/logger");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true }, (code) => {
    console.log(code);
  });
});

client.on("ready", () => {
  console.clear();
  logger.info("❭ Acesso salvo com sucesso! ❬");
  logger.info(
    '❭ Digite no terminal: "make start", para iniciar o Assistent. ❬'
  );
  process.exit(0);
});

(async () => {
  console.clear();
  logger.info("❭ Carregando...");
  client.initialize();
})();
