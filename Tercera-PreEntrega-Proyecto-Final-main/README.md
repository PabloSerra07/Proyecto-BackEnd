# RUTAS

`/api/products (GET)`
-devuelve todos los productos

`/api/products/:id (GET)`
-devuelve un producto según su id

`/api/products (POST)` 
-recibe y agrega un producto, y lo devuelve con su id asignado.

`/api/products/:id (PUT)` 
-recibe y actualiza un producto según su id.

`/api/products/:id (DELETE)` 
-elimina un producto según su id.

`/api/cart (GET)` 
-Crea un carrito y devuelve su id.

`/api/cart/:userID (POST)`
-Si el usuario no tiene un ID de carrito asignado, se crea uno y se le asigna.

`/api/cart/:id/user/:userID (DELETE)` 
-Vacía un carrito, lo elimina y le borra el cartID asignado al usuario para que se le cree uno nuevo.

`/api/cart/:idCart/products (GET)` 
-Me permite listar todos los productos que tiene el carrito con dicho id.

`/api/cart/:idCart/products/:idProd (POST)` 
-Para incorporar productos al carrito.

`/api/cart/:idCart/products/:idProd (DELETE)` 
-Eliminar un producto del carrito por su id de carrito y de producto.

`/api/cart/:idCart/order/:idUser (POST)`
-Crea una nueva orden de compra y notifica al admin y al user.


`/session/login (GET)`
-Renderiza el formulario de inicio de sesión.

`/session/login (POST)`
-Envia el formulario de login y verifica autenticación.

`/session/register (GET)`
-Renderiza el formulario de registro.

`/session/register (POST)`
-Envia el formulario de registro y autentica.

`/session/faillogin (GET)`
-Renderiza una vista al fallar el inicio de sesión.

`/session/failregister (GET)`
-Renderiza una vista al fallar el registro.

`/session/logout (GET)`
-Destruye la sesión y desconecta la base de datos.



# SERVIDOR:
## CLUSTER O FORK:
-`node server.js -m` | Se ejecuta, dependiendo del valor del argumento "-m" (CLUSTER O FORK), en modo CLUSTER o FORK:
-`node server.js -m cluster` | modo cluster con los máximos procesos posibles.
-`node server.js -m fork` | modo fork
-`node server.js` | Se ejecuta el servidor en modo FORK por default.
-`kill (PID)` | EN MODO CLUSTER (Si se mata una terminal se levanta una nueva)

## FOREVER:
(fork)
-`forever start server.js`
-`forever list` | listo todos los procesos.
-`forever stopall` | detendo todos los procesos.

## PM2:
-`pm2 start --watch server.js` | Ejecuto en modo fork.
-`pm2 start server.js --watch -i max` | ejecuto en modo cluster con con los máximos procesos posibles.
-`pm2 list` | listo los procesos.
-`pm2 stop 1` | detengo el proceso con id "1".
-`pm2 delete 1` | elimino el proceso con id "1".
-`pm2 delete all o server` | elimino todos los procesos.