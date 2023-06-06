import messages_repository from "../repository/messages_repository.js";
import { logger } from "../../config/winston_config.js";
import { io } from "../server.js";

let isWebSocketInitialized = false

export const WebSocket_controller = async (req, res) => {

  let user = req.session.user;

  res.render("chat");

  if(!isWebSocketInitialized){

    io.on("connection", (socket) => {
      ListMsjs_controller()
      .then((msjs) => {
          socket.emit("messages", msjs);
      });
  
      socket.on("newMessage", (msj) => {
        SaveMsj_controller(msj, user)
          .then((msjs) => {
              io.sockets.emit("messages", msjs);
          });
      });
    });
    isWebSocketInitialized = true
  }
};

const ListMsjs_controller = async () => {
  try {
    const msjs = await messages_repository.find();
    return msjs;
  } catch (err) {
    logger.info(`Error al listar MSJS en controller: ${err}`);
  }
};

const SaveMsj_controller = async (msj, user) => {
  try {
    const msjs = await messages_repository.save(msj, user);
    return msjs;
  } catch (err) {
    logger.info(`Error al guardar MSJS en controller: ${err}`);
  }
};

export const ListMsjsByEmail_controller = async (req, res) => {
  try {
    const { email } = req.params;
    const msjsByEmail = await messages_repository.findByEmail(email);
    res.json(msjsByEmail)
  } catch (err) {
    logger.info(`Error al listar MSJS por Email en controller: ${err}`);
  }
};
