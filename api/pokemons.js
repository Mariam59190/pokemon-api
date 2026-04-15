const pokemons = require("../db-pokemons");
const { success, error } = require("../helper");

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getNextPokemonId() {
  return pokemons.length > 0
    ? Math.max(...pokemons.map(pokemon => pokemon.id)) + 1
    : 1;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    const searchValue = normalizeText(req.query.search || "");
    let result = pokemons;

    if (searchValue) {
      result = pokemons.filter(pokemon => {
        const name = normalizeText(pokemon.name);
        const types = Array.isArray(pokemon.types)
          ? pokemon.types.map(type => normalizeText(type)).join(" ")
          : "";
        return name.includes(searchValue) || types.includes(searchValue);
      });
    }

    return res.status(200).send(JSON.stringify(success("Liste des pokemons", result)));
  }

  if (req.method === "POST") {
    const { name, image, picture, hp, cp, types } = req.body;
    const pictureUrl = (picture || image || "").trim();

    if (!name || !pictureUrl) {
      return res.status(400).json(error("Le nom et l'image sont obligatoires"));
    }

    const newPokemon = {
      id: getNextPokemonId(),
      name: name.trim(),
      hp: Number(hp) || 20,
      cp: Number(cp) || 5,
      picture: pictureUrl,
      types: Array.isArray(types) && types.length > 0 ? types : ["Normal"],
      created: new Date()
    };

    pokemons.push(newPokemon);
    return res.status(201).json(success("Pokémon ajouté", newPokemon));
  }

  return res.status(405).json(error("Méthode non autorisée"));
};