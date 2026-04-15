const express = require("express");
const cors = require("cors");
const path = require("path");
const pokemons = require("./db-pokemons");
const { success, error } = require("./helper");

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

app.get("/api/pokemons", (req, res) => {
  const searchValue = normalizeText(req.query.search || "");
  console.log(`GET /api/pokemons search=${searchValue}`);

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

  return res.json(success("Liste des pokemons", result));
});

app.get("/api/pokemons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(`GET /api/pokemons/${id}`);

  const pokemon = pokemons.find(item => item.id === id);
  if (!pokemon) {
    return res.status(404).json(error("Pokémon introuvable"));
  }

  return res.json(success("Pokémon trouvé", pokemon));
});

app.post("/api/pokemons", (req, res) => {
  const { name, image, picture, hp, cp, types } = req.body;
  console.log("POST /api/pokemons", req.body);

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
});

app.delete("/api/pokemons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(`DELETE /api/pokemons/${id}`);

  const index = pokemons.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json(error("Pokémon introuvable"));
  }

  const removedPokemon = pokemons.splice(index, 1)[0];
  return res.json(success("Pokémon supprimé", removedPokemon));
});

app.listen(PORT, () => {
  console.log(`🔥 API Pokédex running on http://localhost:${PORT}`);
});
