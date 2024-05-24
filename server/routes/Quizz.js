const express = require('express');
const router = express.Router();
const { User,Quizz, Question, sequelize } = require('../models');
const authenticateToken = require('../middleware/authToken');

// CREATE
router.post('/quizz',authenticateToken, async (req, res) => {
    const { questions, ...quizzData } = req.body;

    try {
        // Démarrez une transaction Sequelize
        await sequelize.transaction(async (t) => {
            // Créez le quizz
            const quizz = await Quizz.create({ ...quizzData, CreatedBy: req.user.userId }, { transaction: t });

            // Créez les questions liées au quizz
            if (questions && questions.length > 0) {
                await Promise.all(
                    questions.map(async (questionData) => {
                        await Question.create({ ...questionData, QuizzId: quizz.id }, { transaction: t });
                    })
                );
            }

            // Renvoyez le quizz créé avec les questions associées
            res.status(201).json(quizz);
        });
    } catch (error) {
        console.error('Erreur lors de la création du quizz et des questions associées :', error);
        res.status(500).json({ message: 'Erreur lors de la création du quizz et des questions associées.' });
    }
});

// UPDATE
router.put('/quizz/:id', authenticateToken, async (req, res) => {
    try {
        const quizzId = req.params.id;
        const { titre, questions } = req.body;

        const quizz = await Quizz.findByPk(quizzId);

        if (!quizz) {
            return res.status(404).json({ message: 'Quizz non trouvé.' });
        }

        // Mettre à jour le titre du quizz
        quizz.titre = titre;
        await quizz.save();

        // Supprimer les anciennes questions associées au quizz
        await Question.destroy({ where: { quizzId } });

        // Créer de nouvelles questions
        if (questions && questions.length > 0) {
            await Promise.all(questions.map(async (question) => {
                await Question.create({ libelle: question.libelle, quizzId });
            }));
        }

        res.status(200).json({ message: 'Quizz mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du quizz :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du quizz.' });
    }
});




// READ
router.get('/quizz', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        let quizzes;
        if (user.role === 'professeur') {
            quizzes = await Quizz.findAll({
                where: { CreatedBy: user.id }
            });
        } else {
            const groupes = await user.getAssociatedGroups();
            const groupIds = groupes.map(groupe => groupe.id);

            quizzes = await Quizz.findAll({
                where: { GroupeId: groupIds }
            });
        }

        res.status(200).json({ quizzes });
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des quiz.' });
    }
});

// EDIT
router.get('/quizz/:id', async (req, res) => {
    try {
        const quizzId = req.params.id;
        const quizz = await Quizz.findByPk(quizzId, {
            include: [Question]
        });

        if (!quizz) {
            return res.status(404).json({ message: 'Quizz non trouvé.' });
        }

        res.status(200).json(quizz);
    } catch (error) {
        console.error('Erreur lors de la récupération du quizz :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du quizz.' });
    }
});

// DELETE
router.delete('/quizz/:id', async (req, res) => {
    try {
        const quizzId = req.params.id;

        // Supprimer le quizz et les questions associées
        await Quizz.destroy({ where: { id: quizzId } });

        res.status(200).json({ message: 'Quizz supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du quizz :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du quizz.' });
    }
});

module.exports = router;
