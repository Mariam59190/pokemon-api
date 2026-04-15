const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Pokemon', PokemonSchema);