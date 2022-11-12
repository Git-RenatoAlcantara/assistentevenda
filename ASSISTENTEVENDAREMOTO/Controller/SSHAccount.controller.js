const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const SSHOpenFile = require("./SSHOpenFile");
const SSHPremiumRemote = require("./SSHPremiumRemote");
const { SSHUserGen } = require("./SSHUserGen");
const { readFile, writeFile, stat } = require("fs/promises");
class SSHAccount {
  constructor({ order_id, chat_id, item }) {
    this.order_id = order_id;
    this.chat_id = chat_id;
    this.id = item;
  }

  static initialize(dependencia) {
    const instance = new SSHAccount(dependencia);
    return instance;
  }

  async _openAccountsConfig() {
    const configPath = path.join(__dirname, "..", "Config", "products.json");
    const jsonOject = fs.readFileSync(configPath, { encoding: "utf-8" });
    return JSON.parse(jsonOject).premium;
  }

  async saveUserDatabase(userMap) {
    const users_premium_file = path.join(
      __dirname,
      "..",
      "Usuarios",
      "premium.json"
    );
 

    const usersbuckup = fs.existsSync(users_premium_file);
    const user = Object.fromEntries(userMap);

    if (usersbuckup) {
      const approved_file = await readFile(users_premium_file, "utf-8");

      const approved_object = JSON.parse(approved_file, null, 4);
      approved_object.push(user);
      await writeFile(
        users_premium_file,
        JSON.stringify(approved_object, null, 4)
      );
      return;
    }

    await writeFile(users_premium_file, JSON.stringify([user], null, 4));
    return;
  }

  async create() {
    const sshMap = new Map();
    const config = await this._openAccountsConfig();
    const product = config.find((find) => find.id == this.id);
    const sshlist = await SSHOpenFile.open();
    const sshPremiumRemote = new SSHPremiumRemote();
    const { username, password } = SSHUserGen("premium");

    await Promise.resolve(
      sshlist.map(async (ssh) => {
        const { sship, sshpass } = ssh;
        //this._shell(product.validade, product.limite)
        sshPremiumRemote.connect({
          sship,
          sshpass,
          username,
          password,
          expiration: product.validade,
          limit: product.limite,
        });
      })
    );

    const end = moment()
      .add(parseInt(product.validade), "days")
      .format("DD/M/YYYY");

    sshMap.set("User", username);
    sshMap.set("Pass", password);
    sshMap.set("Exp", product.validade + " dias");
    sshMap.set("End", end);
    sshMap.set("Lim", product.limite + " por vez");
    sshMap.set("chat_id", this.chat_id);
    sshMap.set("order_id", this.order_id);
    return sshMap;
  }
}

module.exports.SSHAccount = SSHAccount;
