const express = require('express');
const router = express.Router();
const { User, Groupe, UserGroupe, sequelize } = require('../models');
const authenticateToken = require('../middleware/authToken');

// CREATE
router.post('/groupes', authenticateToken, async (req, res) => {
    const { name, description, emails } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            // Récupérer les utilisateurs par leurs emails
            const users = await User.findAll({
                where: {
                    email: emails
                },
                transaction: t
            });

            // Vérifier que tous les emails correspondent à des utilisateurs
            if (users.length !== emails.length) {
                const foundEmails = users.map(user => user.email);
                const notFoundEmails = emails.filter(email => !foundEmails.includes(email));
                return res.status(400).json({ message: 'Certains emails ne correspondent à aucun utilisateur', notFoundEmails });
            }

            // Créer le groupe
            const groupe = await Groupe.create({ name, description,CreatedBy: req.user.userId }, { transaction: t });

            // Créer les entrées dans la table pivot UserGroupe
            await Promise.all(
                users.map(async (user) => {
                    await UserGroupe.create({ UserId: user.id, GroupeId: groupe.id }, { transaction: t });
                })
            );

            res.status(201).json(groupe);
        });
    } catch (error) {
        console.error('Erreur lors de la création du groupe :', error);
        res.status(500).json({ message: 'Erreur lors de la création du groupe.' });
    }
});

// READ ALL
router.get('/groupes', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const groupes = await user.getGroupes();
        res.status(200).json({ groupes });
    } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes.' });
    }
});


router.get('/groupes/:id', authenticateToken, async (req, res) => {
    try {
        const groupeId = req.params.id;
        const groupe = await Groupe.findByPk(groupeId);
        
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        const users = await groupe.getMembers();
        console.log(users);
        res.status(200).json({ groupe, users });
    } catch (error) {
        console.error('Erreur lors de la récupération du groupe :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du groupe.' });
    }
});


// UPDATE
router.put('/groupes/:id', authenticateToken, async (req, res) => {
    const groupeId = req.params.id;
    const { name, description, emails } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            const groupe = await Groupe.findByPk(groupeId);

            if (!groupe) {
                return res.status(404).json({ message: 'Groupe non trouvé.' });
            }

            groupe.name = name;
            groupe.description = description;
            await groupe.save({ transaction: t });

            await UserGroupe.destroy({ where: { groupeId: groupe.id }, transaction: t });
            // Récupérer les utilisateurs par leurs emails
            const users = await User.findAll({
                where: {
                    email: emails
                },
                transaction: t
            });

            // Vérifier que tous les emails correspondent à des utilisateurs
            if (users.length !== emails.length) {
                const foundEmails = users.map(user => user.email);
                const notFoundEmails = emails.filter(email => !foundEmails.includes(email));
                return res.status(400).json({ message: 'Certains emails ne correspondent à aucun utilisateur', notFoundEmails });
            }

            await Promise.all(
                users.map(async (user) => {
                    await UserGroupe.create({ UserId: user.id, GroupeId: groupe.id }, { transaction: t });
                })
            );

            res.status(200).json({ message: 'Groupe mis à jour avec succès.' });
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du groupe :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du groupe.' });
    }
});

// DELETE
router.delete('/groupes/:id', authenticateToken, async (req, res) => {
    const groupeId = req.params.id;

    try {
        await sequelize.transaction(async (t) => {
            await UserGroupe.destroy({ where: { groupeId }, transaction: t });
            await Groupe.destroy({ where: { id: groupeId }, transaction: t });

            res.status(200).json({ message: 'Groupe supprimé avec succès.' });
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du groupe :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du groupe.' });
    }
});

module.exports = router;
