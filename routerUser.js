/*
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
*/
const user = require('./schemaUserPortfolio');
const express = require('express');
const routerUser = express.Router();
const nodemailer = require('nodemailer');

// ⚡ Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // ou "SendGrid", "Yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER, // ton email
    pass: process.env.EMAIL_PASS, // mot de passe ou clé d'application
  },
});

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
    const newUser = new user({ nom, prenom, email, telephone, message });
    await newUser.save();
    console.log("✅ Données sauvegardées :", newUser);

    // ⚡ Préparation et envoi du mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Merci pour votre inscription !",
      text: `Bonjour ${nom},\n\nMerci de vous être inscrit sur mon portfolio !`,
      // html: `<p>Bonjour <strong>${nom}</strong>,<br>Merci de vous être inscrit sur mon portfolio !</p>`, // optionnel
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Mail envoyé à :", email);

    return res.status(201).json({ message: "Utilisateur enregistré et mail envoyé !" });

  } catch (error) {
    console.error("❌ Erreur backend :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = routerUser;



