const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe
const { User } = require('../models');
const passport = require('passport');
const authenticateToken = require('../middleware/authToken');
const { Op } = require('sequelize');
// Route pour l'inscription
router.post('/register', async (req, res) => {
    try {
        // Récupérer les données de l'utilisateur à partir du corps de la requête
        const { firstName, lastName, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet e-mail est déjà utilisé.' });
        }
        console.log(role);
        // Hacher le mot de passe avant de l'enregistrer dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec les données fournies
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role // Inclure le rôle dans la création de l'utilisateur
        });

        // Répondre avec les données de l'utilisateur créé
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

router.get('/check-authentication', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    // L'utilisateur est authentifié, vous pouvez maintenant accéder à ses informations dans req.user
    try {
        // Récupérer l'ID de l'utilisateur à partir du token
        const userId = req.user.userId;

        // Rechercher l'utilisateur dans la base de données en fonction de son ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // L'utilisateur est trouvé, renvoyer toutes ses informations
        res.status(200).json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des informations de l\'utilisateur.' });
    }
});

// Route pour la connexion
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la connexion.' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la connexion.' });
            }
            // Générer un token JWT
            const token = jwt.sign({ userId: user.id }, 'caca', { expiresIn: '1h' });
            // L'utilisateur est connecté avec succès, renvoyer le token et la redirection
            return res.status(200).json({ token, redirectTo: '/' });
        });
    })(req, res, next);
});

// Route pour la déconnexion
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
        }
        res.status(200).json({ message: 'Déconnexion réussie.' });
    });
});

router.get('/users', authenticateToken, async (req, res) => {
    try {
        const currentUserID = req.user.userId;
        const users = await User.findAll({
            where: {
                id: { [Op.not]: currentUserID }
            }
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

// GET user by ID
router.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
    }
});

// PUT update user by ID
router.put('/user/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        // Mettre à jour les champs nécessaires de l'utilisateur
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        await user.save();
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
});
module.exports = router;
