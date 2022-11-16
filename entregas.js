class usuarios{
    constructor(nombre, apellido, libros, mascotas,){
        this.nombre = nombre,
        this.apellido = apellido,
        this.libros = libros
        this.mascotas = mascotas
    }


getFullName() {
    return `${this.nombre} ${this.apellido}`
};

addMascota(nombreMascotas) {
    (this.mascotas).push(nombreMascotas);
};


countMascotas() {
        let i = 0;
        (this.mascotas).forEach( ()=> i += 1 )
        return i;
    };

addBook(nombreLibro, autor) {
        (this.libros).push({nombre: nombreLibro, autor: autor});
    };

getBookNames() {
        let nombreLibros = [];
        (this.libros).forEach( libro => {
            nombreLibros.push(libro.nombre);
        });
        return nombreLibros;
    };
};

const nombre = 'usuari1';
const apellido = 'apellido1';
const libros = [{nombre: `El Alquimista`,autor: `Paulo Coelho`},{nombre: `Lestat el vampiro`,autor: `Adam Smith`}];
const mascotas = ['Tero','Pavo','Iguana'];

const usuario = new usuarios(nombre,apellido,libros,mascotas);
console.log('Nombre del usuario (string):')
console.log(usuario.getFullName()); 
console.log('Cantidad de mascotas (number):')
console.log(usuario.countMascotas()); 
console.log('Agrego mascota "loro".')
usuario.addMascota('loro');
console.log('Cantidad de mascotas del usuario (number):');
console.log(usuario.countMascotas());
console.log('Nombres de los libros(array):');
console.log(usuario.getBookNames());
console.log('Agrego un nuevo libro (objeto) ')
usuario.addBook('El retrato de Dorian Gray','Oscar Wilde');
console.log('Libros agregados (array):');
console.log(usuario.getBookNames());
