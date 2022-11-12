const qrcode = require("qrcode-terminal");
const { Client, Buttons, LocalAuth, WAState } = require("whatsapp-web.js");
const { SSHAccount } = require("../Controller/SSHAccount.controller");
const fs = require("fs");
const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const { messageFormatter } = require("../Util/message.formatter");
const client_model = require("../Model/client.model");
const { pix } = require("../Controller/pix.generate");
const logger = require("../Log/logger");
const saveOrder = require("../Controller/order_save.controller");

const { SSHTestAccount } = require("../Controller/SSHTestAccount.controller");
const { update } = require("../Controller/PayoutStatus.controller");
const {
  link_downloads,
  link_suporte,
  deleteOrderThatSatusChangeOfPendingToApproved,
} = require("../Util/util");
const mp_makerequest = require("../service/mp_makerequest");
const ExpiratioDate = require("../Util/ExpirationDate");
const mp_pix_cancel = require("../service/mp_pix_cancel");
const Service = require("../Controller/DatabasePendingToApproved.controller");

const getWelcomeMessage = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Buttons", "welcome.json"),
    { encoding: "utf-8" }
  );
  return JSON.parse(file);
};

const getButtonCTA = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Buttons", "callToAction.json"),
    { encoding: "utf-8" }
  );
  return JSON.parse(file);
};

const getContato = async function () {
  const config = await readFile(
    path.join(__dirname, "..", "Config", "geral.json"),
    "utf-8"
  );

  const [content] = JSON.parse(config).Suporte;
  return content;
};

const getMenu = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Buttons", "menu.json"),
    {
      encoding: "utf-8",
    }
  );
  return JSON.parse(file);
};
const getProducts = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Config", "products.json"),
    { encoding: "utf-8" }
  );

  return JSON.parse(file)["premium"];
};

const delay = async (ms) => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

const deletePending = async () => {
  const path_pending = path.join(
    __dirname,
    "..",
    "Database",
    "order.pending.json"
  );
  const service = new Service();
  await service.checkOrderStatusOnMercadoPago();
  const pending_object = await readFile(path_pending, "utf-8");
  const pending_json = JSON.parse(pending_object);
  for (index in pending_json) {
    await mp_pix_cancel(pending_json[index].order_id);

    pending_json.splice(index, 1);
    try {
      await writeFile(path_pending, JSON.stringify(pending_json, null, 4));
    } catch (error) {
      console.log(error);
    }
  }
};

const getPix = async (amount) => {
  client_model.transaction_amount = parseFloat(amount);

  try {
    return await pix(client_model);
  } catch (error) {
    console.log(error.message);
  }
};

const messageParse = (msg) => {
  const jsonObject = JSON.stringify(msg);
  const jsonObjectToArray = JSON.parse(jsonObject);
  const user = jsonObjectToArray["_data"]["notifyName"];
  const selectedButtonId = jsonObjectToArray["_data"]["selectedButtonId"];
  const message = msg["body"];
  return {
    user: user,
    selectedButtonId: selectedButtonId,
    message: message,
  };
};

const onMessageSymbol = Symbol("onMessage");
const onLoadQRCodeSymbol = Symbol("onLoadQRCode");
const onReadySymbol = Symbol("onReady");
const onOrderApprovedCreateAccountSymbol = Symbol(
  "onOrderApprovedCreateAccount"
);

const onAuthFailureSymbol = Symbol("onAuthFailure");
const onAuthenticatedSymbol = Symbol("onAuthenticated");
class Assistent {
  #words = [
    "olá",
    "menu",
    "ola",
    "oi",
    "olá!",
    "ola!",
    "oi!",
    "bom dia",
    "bomdia",
    "boa tarde",
    "boatarde",
    "bom dia!",
    "bomdia!",
    "boa tarde!",
    "boatarde!",
    "boa noite",
    "boa noite!",
    "boa noite!",
    "boanoite!",
    "/menu",
  ];
  #bot;
  constructor() {
    this.#bot = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        product: "chrome",
        executablePath: "/usr/bin/chromium-browser",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
        ],
      },
    });
    this.#bot.initialize();
    this[onLoadQRCodeSymbol]();
    this[onReadySymbol]();
    this[onMessageSymbol]();
    this[onAuthenticatedSymbol]();
    this[onAuthFailureSymbol]();
  }

  [onLoadQRCodeSymbol] = () => {
    this.#bot.on("qr", (qr) => {
      // Generate and scan this code with your phone
      qrcode.generate(qr, { small: true }, (code) => {
        console.log(code);
      });
    });
  };

  [onReadySymbol] = () => {
    this.#bot.on("ready", async () => {
      logger.info("❭ Aguarde... Verficiando pedidos pendentes. ❬");
      await deletePending();
      logger.info("❭ Assistente está conectado! ❬");
      this[onOrderApprovedCreateAccountSymbol]();
      update();
    });
  };

  [onAuthenticatedSymbol] = () => {
    this.#bot.on("authenticated", () => {
      console.log("AUTHENTICATED");
    });
  };

  [onAuthFailureSymbol] = () => {
    this.#bot.on("auth_failure", (msg) => {
      // Fired if session restore was unsuccessful
      console.error("AUTHENTICATION FAILURE", msg);
    });
  };

  [onMessageSymbol] = () => {
    this.#bot.on("message", async (msg) => {
      const { user, selectedButtonId, message } = messageParse(msg);

      if (this.#words.includes(message.toLowerCase())) {
        const { text, buttons, title, footer } = getWelcomeMessage();

        let button = new Buttons(
          text.replace("$user", user),
          buttons,
          title,
          footer
        );

        this.#bot.sendMessage(msg.from, button);

        return;
      }

      if (selectedButtonId == "continuar") {
        const { text, buttons, title, footer } = getMenu();

        let button = new Buttons(text, buttons, title, footer);
        this.#bot.sendMessage(msg.from, button);
        return;
      }

      if (selectedButtonId == "comprar") {
        const ofertas = getProducts();
        const produtos = ofertas.map((element) => {
          const { id, titulo, descricao, preco, validade, limite } = element;

          const button = {
            text: ` 📌 *${titulo}* 📌\n\n👜 *${descricao}*\n\n💰 *Preço:* ${preco}\n\n📅 *Validade:* ${validade} dias\n\n👤 *Usuários:* ${limite} por vez`,
            buttons: [{ body: "Comprar", id: `${id}` }],
          };
          return button;
        });

        for (let lista of produtos) {
          let button = new Buttons(lista.text, lista.buttons, "", "");
          this.#bot.sendMessage(msg.from, button);
        }
        return;
      }

      if (selectedButtonId == "teste") {
        const sshtestaccount = SSHTestAccount.initialize({
          chat_id: msg.from,
        });

        if (sshtestaccount.block()) {
          await this.#bot.sendMessage(
            msg.from,
            "😟 *Sinto muito, mas você já esgotou seu limite de teste grátis. Mas não fique sem internet, aproveite e compre agora e recebar na hora seu acesso.*"
          );
          const { text, buttons, title, footer } = getButtonCTA();
          let button = new Buttons(text, buttons, title, footer);
          await delay(15000);
          this.#bot.sendMessage(msg.from, button);
          return;
        }

        await this.#bot.sendMessage(
          msg.from,
          "*⏳ Só um momento estou gerando o seu teste gratis* 😜"
        );

        const testssshMap = await sshtestaccount.create();
        const { PlayStoreUrl, MediaFireUrl } = await link_downloads();
        const { ContatoUrl } = await link_suporte();

        await this.#bot.sendMessage(
          msg.from,
          `*CONTA CRIADA COM SUCESSO!*\n\n*Usuário:* ${testssshMap.get(
            "User"
          )}\n*Senha:* ${testssshMap.get("Pass")}\n*Expira:* ${testssshMap.get(
            "Exp"
          )}\n*Limite:* ${testssshMap.get("Lim")}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Link de download
PlayStore: ${PlayStoreUrl}
MediaFire: ${MediaFireUrl}
SUPORTE: ${ContatoUrl}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Obrigado por adquirir nosso produto.`
        );
        return;
      }

      if (selectedButtonId == "duvida") {
        const { ContatoUrl } = await link_suporte();
        await this.#bot.sendMessage(msg.from, `Entre em contato: ${ContatoUrl}`);
      }

      const recover_products = getProducts();

      const bought_product = recover_products.find(
        (find) => find.id == selectedButtonId
      );

      if (bought_product != undefined) {
        await this.#bot.sendMessage(
          msg.from,
          "*⏳ Estou gerando o seu codigo pix para pagamento...*"
        );

        try {
          var { qrcode, id } = await getPix(bought_product.preco);
          await saveOrder(id, msg.from, bought_product.id);
        } catch (error) {
          console.log(error);
        }

        await this.#bot.sendMessage(msg.from, qrcode);
        /* await this.#bot.sendMessage(
          msg.from,
          "🤩 Você receberá seu acesso automáticamente após pagar o pix acima ☝️ *ATENÇÃO* ‼️ caso seu acesso não chegue em até 5 minutos escreva no chat *_Não recebi a minha conta_* em seguida sera enviado caso seu pagamento esteja confirmado!"
        );*/
        await this.#bot.sendMessage(msg.from, `*Pedido:* ${id}`);
        await this.#bot.sendMessage(
          msg.from,
          "☝️ *ATENÇÃO* ‼️ Você tem 5 minutos para efetuar o pagamento. Caso o cotrário, sua compra será cancelado."
        );
        setTimeout(async () => {
          const paid = await mp_makerequest(id);
          if (paid.includes("approved")) {
            return;
          }
          await mp_pix_cancel(id);
          await deletePending(id);
          await this.#bot.sendMessage(
            msg.from,
            `O pedido com o número: *${id}* não foi pago e foi cancelado.`
          );
        }, 310000);
        return;
      }
    });
  };

  [onOrderApprovedCreateAccountSymbol] = async () => {
    // Verifica se axiste alguma ordem aprovada no arquivo order.approved.json
    // Se existir ele cria o a conta e envia
    setInterval(async () => {
      const fileContentPath = fs.readFileSync(
        path.join(__dirname, "..", "Database", "order.approved.json"),
        { encoding: "utf-8" }
      );
      if (!fileContentPath) return;
      const orderApprovedList = JSON.parse(fileContentPath);
      const orderListNotEmpty = orderApprovedList.length > 0;
      if (orderListNotEmpty) {
        const [first, ...rest] = orderApprovedList;
        const { chat_id, order_id, item } = first;
        const sshaccount = SSHAccount.initialize({ order_id, chat_id, item });
        const account = await sshaccount.create();
        await deleteOrderThatSatusChangeOfPendingToApproved(
          path.join(__dirname, "..", "Database", "order.approved.json")
        );
        sshaccount.saveUserDatabase(account);
        const message = await messageFormatter(account);

        this.#bot.sendMessage(account.get("chat_id"), message);
      }
    }, 30000);
  };

  static initialize = function () {
    const assistent = new Assistent();
    return assistent;
  };

  /*
  

 
 
  this.client.on("disconnected", (reason) => {
    console.log("client was logged out", reason);
    setTimeout(() => {
      console.log("Restarting ...");
      start();
    }, 300);
  });
  */
}

module.exports = Assistent;
