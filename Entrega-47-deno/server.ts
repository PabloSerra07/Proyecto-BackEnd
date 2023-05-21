import * as server from "https://deno.land/std@0.170.0/http/server.ts";

const argv = Deno.args;
const PORT = parseInt(argv[0]) || 8080;

function handler(request: Request)  {
  const body = "Hola Mundo";
  return new Response(body, {status: 200});
}

const _server = await server.serve(handler, {port: PORT});