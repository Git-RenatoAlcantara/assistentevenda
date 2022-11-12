const { readFile, writeFile } = require("fs/promises");
const path = require("path");

module.exports.link_suporte = async () => {
  const file = await readFile(
    path.join(__dirname, "..", "Config", "geral.json"),
    "utf-8"
  );
  const download_list = JSON.parse(file).Suporte;

  return download_list[0];
};
module.exports.link_downloads = async () => {
  var file = await readFile(
    path.join(__dirname, "..", "Config", "geral.json"),
    "utf-8"
  );
  const download_list = JSON.parse(file).Download;
  return download_list[0];
};

module.exports.deleteOrderThatSatusChangeOfPendingToApproved = async (
  pathFile
) => {
  const fileContent = await readFile(pathFile, "utf-8");
  if (!fileContent) return;
  const fileContentList = JSON.parse(fileContent);
  if (fileContentList.length <= 0) return;
  fileContentList.shift();
  await writeFile(pathFile, JSON.stringify(fileContentList, null, 4));
};
