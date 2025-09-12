const express = require('express')

const cors = require('cors')

const connexion = require('./mongoose')

const routerUser = require('./routerUser')

 connexion

const app =  express()


app.use(cors());


app.use(express.json());

app.use(routerUser)

app.post("/", (req, res) => {
  console.log("Données reçues :", req.body);
  res.json({ message: "Données bien reçues !" });
});

app.listen(3000, () => {
  console.log("Serveur backend démarré sur http://localhost:3000");
});