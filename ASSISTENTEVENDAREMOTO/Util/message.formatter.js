const { link_downloads, link_suporte } = require("./util");

module.exports.messageFormatter = async (account) => {
  const { PlayStoreUrl, MediaFireUrl } = await link_downloads();
  const { ContatoUrl } = await link_suporte();
  
  return `
*CONTA CRIADA COM SUCESSO!*
*Usuário:* ${account.get("User")}
*Senha:* ${account.get("Pass")}
*Válidade:* ${account.get("Exp")}
*Vencimento:* ${account.get("End")}
*Limite:* ${account.get("Lim")}
*Pedido:* ${account.get("order_id")}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Link de download
PlayStore: ${PlayStoreUrl}
MediaFire: ${MediaFireUrl}
SUPORTE: ${ContatoUrl}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Obrigado por adquirir nosso produto.
`;
};
