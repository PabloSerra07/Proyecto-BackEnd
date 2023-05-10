import mensajes_repository from "../repository/mensajes_repository.js"

export const ListarMsjs_controller = async (req, res) => {
  const mensajes = await mensajes_repository.find();
  res.json(mensajes);
};

export const guardarMsj_controller = async (req, res) => {
  const msj = req.body;
  const mensajes = await mensajes_repository.save(msj);
  res.json(mensajes);
};
