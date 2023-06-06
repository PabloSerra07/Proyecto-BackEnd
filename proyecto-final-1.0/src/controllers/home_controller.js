import { server } from "../server.js";
import { DecodeToken } from "../../config/jsonwebtoken.js";

export const Home_controller = async (req, res) => {
  req.session.cookie.expires = new Date(Date.now() + 600000);
  
  const token = req.cookies.token;
  const userDecoded = DecodeToken(token);
  req.session.user = userDecoded.user;
  const user = userDecoded.user;

  //BOOLEANO PARA LA URL DE LA IMAGEN DEL AVATAR, YA QUE DEPENDERA DEL HOST (LOCAL O REMOTO).
  const hostBoolean = req.hostname == "localhost" ? true : false;
  const url = {
    protocol: req.protocol,
    host: req.hostname,
    port: server.address().port,
    hostBoolean,
  };

  const toRender = Object.assign({}, user, url);
  res.render("inicio", { toRender });
};
