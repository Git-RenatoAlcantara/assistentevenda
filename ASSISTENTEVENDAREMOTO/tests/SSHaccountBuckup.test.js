const { SSHAccount } = require("../Controller/SSHAccount.controller");

test("", () => {
  const sshaccount = SSHAccount.initialize({
    order_id: 1,
    chat_id: 2,
    item: 1,
  });

  const sshMap = new Map();
  sshMap.set("User", "renato");
  sshMap.set("Pass", "renato123");
  sshaccount.saveUserDatabase(sshMap);
});
