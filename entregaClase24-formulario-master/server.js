const express = require('express');
const knex = require('knex');
const app = express();

const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ecommerce'
  }
});

app.get('/', (req, res) => {
  db.select().table('products')
    .then(data => {
      let output = '<table><tr><th>ID</th><th>Nombre</th><th>Precio</th></tr>';
      data.forEach(product => {
        output += `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
          </tr>
        `;
      });
      output += '</table>';
      res.send(output);
    });
});

app.listen(5000, () => {
  console.log('Servidor en el puerto 5000');
});