export function messagesDTO(msj, user) {
  const date = new Date().toLocaleString();

  const { username, email, image } = user;

  return {
    user: { username, email, image },
    timestamp: date,
    text: msj,
  };
}
