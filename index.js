require('dotenv').config();
const express = require('express');
const pokemons = require('./db-pokemons');
const helper = require('./helper');

const app = express();
const PORT = process.env.PORT || 3003;

// 🔥 obligatoire pour lire les JSON (POST)
app.use(express.json());

// -------------------- ROUTES --------------------

// Accueil
app.get('/', (req, res) => {
  res.send("Hello serveur !");
});

// Liste des pokemons
app.get('/api/pokemons', (req, res) => {
  res.json(helper.success("Liste des pokemons", pokemons));
});

// Pokemon par ID
app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find(p => p.id === id);

  res.json(helper.success("Pokemon trouvé", pokemon));
});

// 🔥 AJOUTER un pokemon (POST)
app.post('/api/pokemons', (req, res) => {
  const newPokemon = req.body;

  pokemons.push(newPokemon);

  res.json(helper.success("Pokemon ajouté", newPokemon));
});

// -------------------------------------------------

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
app.delete('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = pokemons.findIndex(p => p.id === id);

  if (index === -1) {
    return res.json(helper.success("Pokemon introuvable", null));
  }

  const deleted = pokemons.splice(index, 1);

  res.json(helper.success("Pokemon supprimé", deleted));
});
app.delete('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = pokemons.findIndex(p => p.id === id);

  if (index === -1) {
    return res.json(helper.success("Pokemon introuvable", null));
  }

  const deleted = pokemons.splice(index, 1);

  res.json(helper.success("Pokemon supprimé", deleted));
});