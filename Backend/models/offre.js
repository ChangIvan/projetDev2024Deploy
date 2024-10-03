const mongoose = require("mongoose");

const offreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  //NomEmployeur: { type: String, required: true },
  email: { type: String, required: true },
  //salaire: { type: Number, required: true },
  //detail: { type: String, required: true },
  employeurId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Offre", offreSchema);