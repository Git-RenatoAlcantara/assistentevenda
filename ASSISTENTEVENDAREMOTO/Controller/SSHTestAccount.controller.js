const path = require("path");
const fs = require("fs");
const {
  TWABoWriteFile,
  TWABotFileExist,
  TWABotOpenFile,
} = require("../Util/TBotZapData");
const SSHOpenFile = require("./SSHOpenFile");
const SSHTestRemote = require("./SSHTestRemote");
const { SSHUserGen } = require("./SSHUserGen");

class SSHTestAccount {
  constructor({ chat_id }) {
    this.chat_id = chat_id;
  }

  static initialize(dependencia) {
    const instance = new SSHTestAccount(dependencia);
    return instance;
  }

  async _openAccountsConfig() {
    const configPath = path.join(__dirname, "..", "Config", "products.json");
    const jsonOject = fs.readFileSync(configPath, { encoding: "utf-8" });
    return JSON.parse(jsonOject);
  }

  async _saveUser(testMap) {
    const testPath = path.join(__dirname, "..", "Database", "tests.json");

    const testObject = Object.fromEntries(testMap);

    if (TWABotFileExist({ path: testPath })) {
      const object = TWABotOpenFile({ path: testPath });
      const testsList = JSON.parse(object);
      testsList.push(testObject);
      TWABoWriteFile({ path: testPath, file: testsList });
      return;
    }
    TWABoWriteFile({ path: testPath, file: [testObject] });
    return;
  }
  async create() {
    const sshMap = new Map();

    const sshlist = await SSHOpenFile.open();
    const { username, password } = SSHUserGen("teste");

    const sshTestRemote = new SSHTestRemote();
    Promise.resolve(
      sshlist.map(async (ssh) => {
        const { sship, sshpass } = ssh;
        const result = await sshTestRemote.connect({
          sship,
          sshpass,
          username,
          password,
        });
        console.log(result);
      })
    );

    sshMap.set("chat_id", this.chat_id);
    sshMap.set("User", username);
    sshMap.set("Pass", password);
    sshMap.set("Exp", "1 hora");
    sshMap.set("Lim", "1 por vez");

    await this._saveUser(sshMap);
    return sshMap;
  }
  block() {
    const testPath = path.join(__dirname, "..", "Database", "tests.json");
    if (TWABotFileExist({ path: testPath })) {
      const object = TWABotOpenFile({ path: testPath });
      const json = JSON.parse(object);
      const user = json.find((find) => find.chat_id == this.chat_id);
      return user == undefined ? false : true;
    }
    return false;
  }
}

module.exports.SSHTestAccount = SSHTestAccount;
