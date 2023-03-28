import mongoose from "mongoose";

const URLMongoDB = 'mongodb+srv://pablo:pablo@cluster0.glswgtz.mongodb.net/?retryWrites=true&w=majority';

mongoose.set("strictQuery", false);

const MsjSchema = new mongoose.Schema(
  {
    author: Object,
    fyh: String,
    text: String
  },
  {
    versionKey: false,
  }
);

const model = mongoose.model("messages", MsjSchema);

class ApiMsjMongoDB {
  constructor() {
    this.model = model
    this.route = URLMongoDB
  }

  async ListarMsjs() {
    try{
      await mongoose.connect(this.route, {
        serverSelectionTimeoutMS: 5000,
      });
      try{
        let msjs = await this.model.find({})
        return msjs
      }catch(error){
        console.log(`Error en operacion de base de datos: ${error}`);
        return {error: 'Error en operacion de base de datos'}
      }
    }catch(error){
      console.log("Error en la conexión a la base de datos " + error);
    }finally{
      mongoose.disconnect().catch((err) => {
        throw new Error("error al desconectar la base de datos");
      });
    }
  }

  async guardarMsj(data) {
    try{
      await mongoose.connect(this.route, {
        serverSelectionTimeoutMS: 5000,
      });
      try{
        const newMsj = new this.model(data);
        await newMsj.save();
        console.log("Mensaje guardado con exito");
      }catch(error){
        console.log(error);
        return {error: 'Error en el archivo del mensaje en la base de datos'}
      }
    }catch(error){
      console.log("Error en la conexión a la base de datos " + error);
    }finally{
      mongoose.disconnect().catch((err) => {
        throw new Error("error al desconectar la base de datos");
      });
    }
  }
}

export default ApiMsjMongoDB;
