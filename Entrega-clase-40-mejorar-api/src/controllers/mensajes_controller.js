import MensajesFactory from "../factory/mensajes_factory.js";
import {MensajeDTO} from "../DTO/mensajes_DTO.js"

// const mensajes_factory_DAO = MensajesFactory.getDAO();

export const ListarMsjs_controller = async (req, res) => {
  const mensajes = await mensajes_factory_DAO.ListarMsjs(); //FALTA REPOSITORY
  socket.emit("mensajes", mensajes);  //VERIFICAR
  res.json(mensajes);
};

export const guardarMsj_controller = async (req, res) => {
  const msj = req.body;
  const msjToSave = MensajeDTO(msj)
  const mensaje = await mensajes_factory_DAO.guardarMsj(msjToSave); //FALTA REPOSITORY
  res.json(mensaje);
};
