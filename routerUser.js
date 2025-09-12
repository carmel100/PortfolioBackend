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

module.exports = routerUser;*/

const user = require('./schemaUserPortfolio');
const express = require('express');
const routerUser = express.Router();
const sgMail = require('@sendgrid/mail');

// ⚡ Configure ta clé SendGrid dans les variables d'environnement Render
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

routerUser.post('/', async (req, res) => {
  const { nom, prenom, email, telephone, message } = req.body;

  try {
    if (!nom || !prenom || !email || !telephone || !message) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Adresse email invalide." });
    }

    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(telephone)) {
      return res.status(400).json({ error: "Numéro de téléphone invalide (8 à 15 chiffres)." });
    }

    // Vérifier doublons téléphone
    const existingUser = await user.findOne({ telephone });
    if (existingUser) {
      return res.status(400).json({ error: "Ce numéro de téléphone est déjà utilisé." });
    }

    // Sauvegarde dans MongoDB
    const newUser = new user({ nom, prenom, email, telephone, message });
    await newUser.save();
    console.log("✅ Données sauvegardées :", newUser);

    // ⚡ Envoi du mail de bienvenue
    const msg = {
      to: email,
      from: 'ton.email@domaine.com', // doit être vérifié dans SendGrid
      subject: 'Merci pour votre inscription !',
      text: `Bonjour ${nom},\n\nMerci de vous être inscrit sur mon portfolio !`,
    };

    await sgMail.send(msg);
    console.log("📧 Mail envoyé à :", email);

    return res.status(201).json({ message: "Utilisateur enregistré et mail envoyé !" });

  } catch (error) {
    console.error("❌ Erreur backend :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = routerUser;


