import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsjMongoDB from "./api/mensajes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'

//--CONFIGURACION Y CONEXION A MONDODB USUARIOS
mongoose.set("strictQuery", false);
const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    }
  },
  {
    versionKey: false,
  }
);

const model = mongoose.model("users", UserSchema);

mongoose.connect('mongodb+srv://pablo:pablo@cluster0.glswgtz.mongodb.net/?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
}).then(()=>{
  console.log('Base de datos en MongoDB conectada');
}).catch((error)=>{
  console.log(`Error al conectarse a la base de datos: ${error}`);
})

const app = express();
const server = createServer(app);
const io = new Server(server);
const apiProdsSQL = new ApiProdsSQL();
const apiMsjMongoDB = new ApiMsjMongoDB();

//PRODUCTOS - MariaDB
// CORROBORA SI EXISTE LA TABLA "PRODUCTOS", SI NO EXISTE, LA CREA.
apiProdsSQL.crearTablaProds();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.engine(
  "hbs",
  handlebars.engine({
    extname: "*.hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("views/layouts"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://coderhouse:coderhouse@coderhouse-backend.iwu4lzw.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 }, // 10 minutos
    rolling: true
  })
);

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {

  function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  try{
    const user = await model.findOne({email: email})
    if(!user){
      console.log('error: no se encontro user');
      return done(null, false);
    }
    if(!isValidPassword(user, password)){
      return done(null, false);
    }
    return done(null, user);
  }catch(err){
    return done('error en strategy 1: '+ err);
  }

}));

passport.serializeUser((user, done) => {
  console.log('serializeUser ejecutado');
  done(null, user.id);
});


passport.deserializeUser( async (id, done) => {
  console.log('deserializeUser ejecutado');

  //----1----
  // model.findById(id, (err, user) =>{
  //   done(err, user)
  // })

  //----2----
  try{
    const user = await model.findById(id)
    done(null, user)
  }catch(err){
    done(err)
  }

  //----3----
  // (async ()=>{
  //   try{
  //     const user = await model.findById(id)
  //     return user
  //   } catch (err) {
  //     return err
  //   }
  // })()
});


//LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/faillogin'
}));

// ASIGNA UN REQ.SESSION.USERNAME EN OTRA RUTA YA QUE EN EL METODO POST "/LOGIN" AUTENTIFICO.
// app.post("/login", passport.authenticate('login', {
//   failureRedirect: '/faillogin'
// }), (req, res)=>{
//   const {email} = req.body
//   res.redirect('/setname/' + email)
// });

// app.get('/setname/:email', (req, res)=>{
//   req.session.email = req.params.email
//   console.log(`Email 1: ${req.params.email}`);
//   console.log(`Email 2: ${req.session.email}`);
//   res.redirect('/')
// })


//REGISTER
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

  const {name, email, password} = req.body

  const user = {username: name, email: email, password: password}

  async function RegisterUser(password) {

    try {

      let users = await model.find({});
      
      if( users.some( u => u.email == user.email) ){
  
        console.log('El usuario ya existe');

        res.redirect("/failregister");

      } else {

        user.password = password
        const newUser = new model(user);
        await newUser.save();
        console.log('Usuario registrado con exito');
        res.redirect("/login");
      }

    } catch (error) {
      console.log(`Error en la query de la base de datos, en funcion RegisterUser: ${error}`);
    }

  };

  //ENCRIPTO LA CONTRASEÑA
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    RegisterUser(hash)
  });

});

//INICIO
app.get("/", (req, res) => {

  if(req.session){

    req.session.cookie.expires = new Date(Date.now() + 600000);

    // const email = req.session.email;

    res.render("inicio", {});

    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");
  
      //MSJS
  
      apiMsjMongoDB.ListarMsjs().then((msjs) => {
        socket.emit("mensajes", msjs);
      });
  
      socket.on("nuevo-mensaje", (data) => {
        apiMsjMongoDB
          .guardarMsj(data)
          .then(() => {
            console.log("Mensaje cargado en la base de datos");
            return apiMsjMongoDB.ListarMsjs();
          })
          .then((msj) => {
            io.sockets.emit("mensajes", msj);
            console.log("Vista de mensajes actualizada");
          });
      });
  
      //PRODS
  
      apiProdsSQL.ListarProds().then((prods) => {
        socket.emit("productos", prods);
      });
  
      socket.on("nuevo-producto", (data) => {
        apiProdsSQL
          .guardarProd(data)
          .then(() => {
            console.log("Producto cargado en la base de datos");
            return apiProdsSQL.ListarProds();
          })
          .then((prods) => {
            io.sockets.emit("productos", prods);
            console.log("Vista de productos actualizada");
          });
      });
    });

  }else{
    res.redirect("/login")
  };
});

//MOCK - FAKE PRODS
app.get("/api/productos-test", (req, res) => {
  const productosFake = apiProdsSQL.FakeProds();
  res.render("productos-test", { productosFake });
});

//FALLA AL LOGEAR
app.get("/faillogin", (req, res) => {
  res.render("faillogin");
});

//FALLA AL REGISTRAR
app.get("/failregister", (req, res) => {
  res.render("failregister");
});

//LOG OUT
app.post("/logout", (req, res) => {
  const nombre = req.session.username;
  req.session.destroy(error => {
    if(error){
      console.log(error);
      return;
    }else{
      res.render("logout", {nombre})
    }
  });
});

//SERVIDOR
// ----------------------------------------------|

const PORT = 8080;

const srv = server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${srv.address().port}`);
});

server.on("error", (error) => {
  console.log(`Error en servidor: ${error}`);
});
