const path = require("path");
const { writeFile, readFile, stat } = require("fs/promises");
const filePath = path.join(__dirname, "..", "Config", "SSH.json");
class SSHOpenFile {
  open = async function () {
    const ssh = await readFile(filePath, "utf-8");
    if (!stat(filePath)) await writeFile(filePath, JSON.parse([]));
    if (ssh) {
      return JSON.parse(ssh);
    }
  };
}

module.exports = new SSHOpenFile();
