const mongoose = require('mongoose');

// Définition du schéma utilisateur
const schema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  telephone: {
    type: Number,
    unique: true,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

// Création du modèle "User" basé sur le schéma
const User = mongoose.model('User', schema);

module.exports = User;
