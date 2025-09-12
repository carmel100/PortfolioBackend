
const user = require('./schemaUserPortfolio');
const express = require('express');
const routerUser = express.Router();

routerUser.post('/', async (req, res) => {
  const { nom, prenom, email, telephone, message } = req.body;

  try {
    // Vérifier que tous les champs sont présents
    if (!nom || !prenom || !email || !telephone || !message) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérification email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Adresse email invalide." });
    }

    // Vérification téléphone (8 à 15 chiffres uniquement)
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(telephone)) {
      return res.status(400).json({ error: "Numéro de téléphone invalide (8 à 15 chiffres)." });
    }

    // ✅ Sauvegarde dans MongoDB
    const newUser = new user({
      nom,
      prenom,
      email,
      telephone,
      message,
    });

    await newUser.save();

    console.log("✅ Données sauvegardées :", newUser);

    return res.status(201).json({ message: "Utilisateur enregistré avec succès !" });

  } catch (error) {
    console.error("❌ Erreur backend :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = routerUser;
