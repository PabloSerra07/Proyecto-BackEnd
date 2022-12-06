const fs = require (`fs`)

class Contenedor {
    constructor(nombre){
        this.ruta =`./${nombre}.json`;
        this.id = 1;
        this.createFile();
    }
    createFile = ()=>{
        if (!fs.existsSync(this.ruta)){
            fs.writeFileSync(this.ruta, `[]`)
        }
    }
    save(){

    }
    getById(){

    }
    getAll(){

    }
    deleteById(){

    }
    deleteAll(){

    }

}
