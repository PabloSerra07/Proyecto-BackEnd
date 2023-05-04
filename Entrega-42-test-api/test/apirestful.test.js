import axios from "axios"
import assert from "assert"
import supertest from "supertest" 
import chai from "chai"

const expect = chai.expect

const BASE_URL = "http://localhost:8080";

const supertestClient = supertest(BASE_URL)

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, 
  headers: {
    'Content-type': 'application/json'
  }
})

describe("Pruebas funcionales Productos API", () => {

  //AXIOS
  it ("Obtener la lista de productos", async()=>{
    const resp = await axiosInstance.get("/api/productos");
    const status = resp.status;
    assert.strictEqual(status, 200);
  })

  //supertestClient
  it("Crear un nuevo producto", async () => {
    const productToSave = {
      title: "test",
      brand: "test",
      price: 97,
      stock: 97,
      thumbnail: ""
    } 

    let resp;

    resp = await supertestClient
      .post("/api/productos/save")
      .send(productToSave)
    ;

    assert.strictEqual(resp.status, 200);
  });

  it("Retornar status 409 al intentar agregar un producto ya existente", async () => {
    const productToSave = {
      title: "Galaxy S22",
      brand: "test",
      price: 99,
      stock: 99,
      thumbnail: ""
    } 

    let resp;

    resp = await supertestClient
      .post("/api/productos/save")
      .send(productToSave)
    ;

    assert.strictEqual(resp.status, 409);
  })

  it("Eliminar un producto por ID", async () => {

    //DOCUMENTO (PROD) CREADO PREVIAMENTE CON LA FINALIDAD DE SER ELIMINADO POR EL TEST.
    const ID = "6451b58ce8e9304837b7db36"    

    let resp;

    resp = await supertestClient
      .delete(`/api/productos/delete/${ID}`)
    ;

    assert.strictEqual(resp.status, 200);
  
  })

})