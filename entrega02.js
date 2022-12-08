const fs = require (`fs`)


class Contenedor {
    constructor(){
        this.ruta = `./productos.txt`
        this.id = 1;
        this.createFile();
    }
    createFile = ()=>{
        if (!fs.existsSync(this.ruta)){
            fs.writeFileSync(this.ruta, `[]`)
        }
    }
    save = async (objeto) => {
        let data = await fs.promises.readFile(this.ruta, `utf8`)
        let content = JSON.parse(data)
        if(content.length ==0){
            objeto.id = this.id;
            content.push(objeto);
            await fs.promises.writeFile(this.ruta, JSON.stringify(content, null, `\t`))
        }
        else{
            this.id = content.length;
            objeto.id = this.id;
            content.push(objeto)
            await fs.promises.writeFile(this.ruta, JSON.stringify(content, null, `\t`))
        }
    }
    getById(id){
        
        let datos = datosArray(`./productos.txt`) 
        console.log(datos)
        let result = datos.find((dato)=>dato.id==id)
        console.log(result)
        return result
    }
        
        
    
    getAll(){
        
        let datos = fs.readFileSync(this.ruta , `utf-8` )
        let datosJson = JSON.parse(datos.toString().trim())
        return datosJson        
    
    }
    
    
    deleteById(id){
        
        let datos = this.getAll();
        console.log(datos)
        let result = datos.filter(function(ele){ 
            return ele.id != id; 
        });
        fs.promises.writeFile(this.ruta, JSON.stringify(result, null, `\t`))

    }
    deleteAll(){
        fs.unlinkSync(`./productos.txt`)
    }

}

let ejemplo = new Contenedor(`./productos.txt`);

/* delted by Id  */
console.log(ejemplo.deleteById(2))