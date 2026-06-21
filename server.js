const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chemins des fichiers JSON
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SOINS_FILE = path.join(__dirname, 'data', 'soins.json');

// Helpers pour lire/écrire les données
async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function writeData(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

// --- ROUTES AUTH & UTILISATEURS ---

// Login
app.post('/api/login', async (req, res) => {
    const { nom, pass } = req.body;
    try {
        const users = await readData(USERS_FILE);
        const user = users.find(u => u.nom.toLowerCase() === nom.toLowerCase() && u.pass === pass);
        
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Inscription (Infirmier)
app.post('/api/register', async (req, res) => {
    const { nom, pass } = req.body;
    if (!nom || !pass) return res.status(400).json({ success: false, message: "Champs obligatoires." });

    try {
        const users = await readData(USERS_FILE);
        if (users.find(u => u.nom.toLowerCase() === nom.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Utilisateur existe déjà." });
        }

        const newUser = { id: Date.now(), nom, pass, role: "infirmier" };
        users.push(newUser);
        await writeData(USERS_FILE, users);
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Obtenir tous les utilisateurs (Admin)
app.get('/api/users', async (req, res) => {
    try {
        const users = await readData(USERS_FILE);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Ajouter un utilisateur (Admin)
app.post('/api/users', async (req, res) => {
    const { nom, pass, role } = req.body;
    if (!nom || !pass) return res.status(400).json({ success: false, message: "Champs obligatoires." });

    try {
        const users = await readData(USERS_FILE);
        if (users.find(u => u.nom.toLowerCase() === nom.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Ce nom d'utilisateur existe déjà." });
        }

        const newUser = { id: Date.now(), nom, pass, role: role || "infirmier" };
        users.push(newUser);
        await writeData(USERS_FILE, users);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modifier un utilisateur (Admin)
app.put('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nom, pass, role } = req.body;

    try {
        let users = await readData(USERS_FILE);
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ error: "Utilisateur non trouvé" });

        users[idx] = { ...users[idx], nom, pass, role };
        await writeData(USERS_FILE, users);
        res.json(users[idx]);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Supprimer un utilisateur (Admin)
app.delete('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        let users = await readData(USERS_FILE);
        users = users.filter(u => u.id !== id);
        await writeData(USERS_FILE, users);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// --- ROUTES SOINS ---

// Obtenir les soins
app.get('/api/soins', async (req, res) => {
    try {
        let soins = await readData(SOINS_FILE);
        res.json(soins);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Ajouter un soin
app.post('/api/soins', async (req, res) => {
    const { infirmierId, date, heureDebut, heureFin, distanceKm } = req.body;
    try {
        const soins = await readData(SOINS_FILE);
        const newSoin = {
            id: Date.now(),
            infirmierId,
            date,
            heureDebut,
            heureFin,
            distanceKm
        };
        soins.push(newSoin);
        await writeData(SOINS_FILE, soins);
        res.status(201).json(newSoin);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modifier un soin
app.put('/api/soins/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { infirmierId, date, heureDebut, heureFin, distanceKm } = req.body;
    
    try {
        let soins = await readData(SOINS_FILE);
        const idx = soins.findIndex(s => s.id === id);
        if (idx === -1) return res.status(404).json({ error: "Soin non trouvé" });

        soins[idx] = { id, infirmierId, date, heureDebut, heureFin, distanceKm };
        await writeData(SOINS_FILE, soins);
        res.json(soins[idx]);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Supprimer un soin
app.delete('/api/soins/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        let soins = await readData(SOINS_FILE);
        soins = soins.filter(s => s.id !== id);
        await writeData(SOINS_FILE, soins);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
