'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Producto = use('App/Models/ProductosSchema')

Route.on('/').render('welcome')
Route.get('/productos', 'ProductoController.index')
Route.get('/productos/:number', 'ProductoController.findByNumber')
Route.post('/productos', 'ProductoController.createProducto')
Route.post('/productos/:number', 'ProductoController.deleteProducto')