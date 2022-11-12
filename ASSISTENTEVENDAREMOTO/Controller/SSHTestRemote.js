const { exec, spawn } = require("node:child_process");
const path = require("path");
const shellpath = path.join(__dirname, "..", "Shell", "SSHTesteRemote.sh");

class SSHTestRemote {
  constructor() {}

  connect({ sship, sshpass, username, password }) {
    return new Promise((resolve, reject) => {
      if (!sship) throw new Error("IP do ssh está vaio.");
      if (!sshpass) throw new Error("Senha do ssh está vazio.");
      if (!username) throw new Error("Usuário está vazio.");
      if (!password) throw new Error("Senha está vazio.");
      exec(
        `bash ${shellpath} ${sship} ${sshpass} ${username} ${password}`,
        (error, stdout, stderr) => {
          if (error) reject(new Error(error));
          //if (stderr) reject(new Error(stderr));
          if (stdout) {
            resolve(stdout);
          }
        }
      );
    });
  }
}

module.exports = SSHTestRemote;
