import knexLib from "knex";
import optionsMariaDB from "../options/mariaDB.js";
import {faker} from '@faker-js/faker';
faker.locale = 'es'

class ApiProdsSQL {
  constructor() {
    this.knex = knexLib(optionsMariaDB);
  }

  crearTablaProds() {
    this.knex.schema.hasTable("productos").then((resp) => {
      Existe(resp);
    });

    const Existe = (existe) => {
      if (existe) {
        return this.knex("productos").select("*");
      } else {
        console.log("La tabla productos no existe y se procede a ser creada");
        this.knex.schema
          .createTable("productos", (table) => {
            table.increments("id").primary();
            table.string("title", 50).notNullable();
            table.string("thumbnail", 1000);
            table.float("price");
          })
          .then(() => {
            console.log("tabla creada");
            const productos = [
              {
                title: "Series",
                price: 200,
                thumbnail: "https://i.pinimg.com/564x/81/c2/d5/81c2d592f541fed2d1b0f68b2d969057.jpg",
                id: 1,
              },
            ];
            return this.knex("productos").insert(productos);
          })
          .then(() => {
            console.log("Productos insertados con exito");
            return this.knex("productos").select("*");
          });
      }
    };
  }

  ListarProds() {
    return this.knex("productos").select("*");
  }

  guardarProd(newProd) {
    return this.knex("productos").insert(newProd);
  }

  FakeProds(){   
    
    const RandomProd = ()=> {
      return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        //utilizo imagen de prueba ya que el antivirus me informa que los url de imagenes de faker poseen URL:Phishing
        thumbnail: "https://dummyimage.com/300"
      }
    } 
    const products = []
    for(let i = 0; i < 5; i++) {
      products.push(RandomProd())
    }
    return products
  }

}

export default ApiProdsSQL;
