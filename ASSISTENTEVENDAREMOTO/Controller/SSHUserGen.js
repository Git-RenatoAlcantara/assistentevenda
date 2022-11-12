random = function (max) {
  return Math.floor(Math.random() * (max - 1)) + 3;
};
module.exports.SSHUserGen = function (tagName) {
  let username = random(9999);
  let password = random(99999);
  username = tagName + username;
  return { username, password };
};
