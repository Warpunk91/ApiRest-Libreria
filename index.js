const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const mongoUri = process.env.MONGODB_URI;

try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch (error) {
    console.error("Error de conexón", error);
}



const PORT = process.env.PORT || 3000;

//Modelo
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
  });

const Libro = mongoose.model("Libro", libroSchema);


//Rutas
app.get("/api", (req, res) => {
    res.send("Bienvenido a la app de libros");
  });


app.use((req, res, next)=> {
  const authToken = req.headers["authorization"];
  if(authToken ==="miTokenSecreto123"){
    next();
  }else{
    res.status(401).send("Acceso no autorizado");
  }
})


//Ruta para crear nuevo libro
  app.post("/libros", async (req, res) => {
    const libro = new Libro({
      titulo: req.body.titulo,
      autor: req.body.autor,
    });

    try {
      await libro.save();
      res.json(libro);
    } catch (error) {
      res.status(500).send("Error al guardar libro");
    }
  });

//Ruta para pedir libros
  app.get("/libros", async (req, res) => {
    try {
      const libros = await Libro.find();
      res.json(libros);
    } catch (error) {
      res.status(500).send("Error al obtener libros");
    }
  });


//Ruta para obtener un libro específico por su ID
  app.get("/libros/:id", async (req, res) => {
    try {
      const libro = await Libro.findById(req.params.id);
      if (libro) {
        res.json(libro);
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al buscar el libro");
    }
  });


  app.get("/libroTitulo", async(req,res) => {
    try {
      const tituloLibro = req.query.titulo;
      const libro = await Libro.findOne({titulo: tituloLibro});
      if(libro){
        res.json(libro);
      }else{
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al buscar el libro");
    }
  })


//Ruta para actualizar un libro específico por su ID
  app.put("/libros/:id", async (req, res) => {
    try {
      const libro = await Libro.findByIdAndUpdate(
        req.params.id,
        {
          titulo: req.body.titulo,
          autor: req.body.autor,
        },
        { new: true } // Esta opción hará que se devuelva el documento actualizado
      );

      if (libro) {
        res.json(libro);
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al actualizar el libro");
    }
  });


//Ruta para eliminar un libro específico por su ID  
  app.delete("/libros/:id", async (req, res) => {
    try {
      const libro = await Libro.findByIdAndDelete(req.params.id);
      if (libro) {
        res.status(204).send();
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al eliminar el libro");
    }
  });


  app.listen(PORT, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
  });