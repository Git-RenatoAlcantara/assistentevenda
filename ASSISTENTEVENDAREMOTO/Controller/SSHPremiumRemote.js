const { exec } = require("node:child_process");
const path = require("path");

const shellpath = path.join(__dirname, "..", "Shell", "SSHPremiumRemote.sh");

class SSHPremiumRemote {
  constructor() {}

  connect({ sship, sshpass, username, password, expiration, limit }) {
    return new Promise((resolve, reject) => {
      if (!sship) throw new Error("IP do ssh está vaio.");
      if (!sshpass) throw new Error("Senha do ssh está vazio.");
      if (!username) throw new Error("Usuário está vazio.");
      if (!password) throw new Error("Senha está vazio.");
      exec(
        `${shellpath} ${username} ${password} ${expiration} ${limit} ${sship} ${sshpass}`,
        (error, stdout, stderr) => {
          if (error) reject(new Error(error));
          //if (stderr) reject(new Error(stderr));
          console.log(stdout);
          resolve();
        }
      );
    });
  }
}

module.exports = SSHPremiumRemote;
