const pokemons = require("../../../db-pokemons");
const { success, error } = require("../../../helper");

module.exports = async (req, res) => {
  const id = Number(req.query.id);
  const pokemon = pokemons.find(item => item.id === id);

  if (req.method === "GET") {
    if (!pokemon) {
      return res.status(404).json(error("Pokémon introuvable"));
    }
    return res.status(200).json(success("Pokémon trouvé", pokemon));
  }

  if (req.method === "DELETE") {
    if (!pokemon) {
      return res.status(404).json(error("Pokémon introuvable"));
    }

    const index = pokemons.findIndex(item => item.id === id);
    const removedPokemon = pokemons.splice(index, 1)[0];
    return res.status(200).json(success("Pokémon supprimé", removedPokemon));
  }

  return res.status(405).json(error("Méthode non autorisée"));
};