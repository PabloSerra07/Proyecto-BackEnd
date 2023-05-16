'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductosSchema extends Schema {
  up () {
    this.create('productos', (table) => {
      table.increments()
      table.integer('number').unique().notNullable()
      table.string('title', 45).unique().notNullable()
      table.float('price').unique().notNullable()
      table.string('url_foto').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('productos')
  }
}

module.exports = ProductosSchema
