const express = require('express');
const router = express.Router();
const { Answer, User, Quizz, Question, sequelize } = require('../models');
const authenticateToken = require('../middleware/authToken');
const { Op } = require('sequelize');

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
                await Question.create({ libelle: question.libelle, QuizzId : quizzId });
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
            return res.status(404).json({ message: 'Quizz non trouvéw.' });
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

router.post('/quizz/:id/answer', authenticateToken, async (req, res) => {
    const quizzId = req.params.id;
    const { questionId, answer } = req.body;
    const userId = req.user.userId; // Assurez-vous que cette information est disponible après authentification

    try {
        // Vérifiez que le quiz existe
        const quizz = await Quizz.findByPk(quizzId);
        if (!quizz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }

        // Vérifiez que la question appartient au quiz
        const question = await Question.findOne({
            where: {
                id: questionId,
                QuizzId: quizzId
            }
        });
        if (!question) {
            return res.status(404).json({ message: 'Question non trouvée dans ce quiz' });
        }

        // Créez une nouvelle réponse
        const newAnswer = await Answer.create({
            libelle: answer,
            QuestionId: questionId,
            StudentId: userId
        });

        res.status(201).json({ message: 'Réponse soumise avec succès', answer: newAnswer });
    } catch (error) {
        console.error('Erreur lors de la soumission de la réponse :', error);
        res.status(500).json({ message: 'Erreur lors de la soumission de la réponse.' });
    }
});

router.get('/quizz/:id/users', authenticateToken, async (req, res) => {
    try {
        const quizzId = req.params.id;

        // Trouver toutes les questions du quiz
        const questions = await Question.findAll({
            where: { QuizzId: quizzId },
            attributes: ['id']
        });

        // Extraire les IDs des questions
        const questionIds = questions.map(question => question.id);

        // Trouver tous les utilisateurs qui ont répondu à ces questions
        const users = await User.findAll({
            include: [{
                model: Answer,
                where: { QuestionId: questionIds },
                attributes: []
            }],
            attributes: ['id', 'firstName', 'lastName']
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

router.get('/quizz/:quizzId/users/:userId/responses', authenticateToken, async (req, res) => {
    try {
        const { quizzId, userId } = req.params;

        // Trouver toutes les questions du quiz
        const questions = await Question.findAll({
            where: { QuizzId: quizzId },
            attributes: ['id']
        });

        // Extraire les IDs des questions
        const questionIds = questions.map(question => question.id);

        // Trouver toutes les réponses de l'utilisateur pour ces questions
        const answers = await Answer.findAll({
            where: {
                QuestionId: questionIds,
                StudentId: userId
            },
            include: [
                { model: Question, attributes: ['libelle'] }
            ]
        });

        res.status(200).json({ answers });
    } catch (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réponses.' });
    }
});

router.put('/quizz/responses/:responseId/accept', authenticateToken, async (req, res) => {
    try {
        const { responseId } = req.params;

        // Trouver la réponse
        const answer = await Answer.findByPk(responseId);

        if (!answer) {
            return res.status(404).json({ message: 'Réponse non trouvée.' });
        }

        // Mettre à jour la réponse pour l'accepter
        answer.isAccepted = true;
        await answer.save();

        res.status(200).json({ message: 'Réponse acceptée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la réponse :', error);
        res.status(500).json({ message: 'Erreur lors de l\'acceptation de la réponse.' });
    }
});

router.put('/quizz/responses/:responseId/reject', authenticateToken, async (req, res) => {
    try {
        const { responseId } = req.params;

        // Trouver la réponse
        const answer = await Answer.findByPk(responseId);

        if (!answer) {
            return res.status(404).json({ message: 'Réponse non trouvée.' });
        }

        // Mettre à jour la réponse pour la refuser
        answer.isAccepted = false;
        await answer.save();

        res.status(200).json({ message: 'Réponse refusée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du refus de la réponse :', error);
        res.status(500).json({ message: 'Erreur lors du refus de la réponse.' });
    }
});

// Avoir les reponses
router.get('/quizz/:id/answers', authenticateToken, async (req, res) => {
    try {
        const quizzId = req.params.id;
        const userId = req.user.userId;

        const answers = await Answer.findAll({
            where: {
                '$Question.QuizzId$': quizzId,
                StudentId: userId
            },
            include: [
                { model: Question, attributes: ['id', 'libelle', 'QuizzId'] }
            ]
        });

        res.status(200).json(answers);
    } catch (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réponses.' });
    }
});

// a repondu a toutes les questions ou non
router.get('/quizz/:id/responses/status', authenticateToken, async (req, res) => {
    try {
        const quizzId = req.params.id;
        const userId = req.user.userId;

        const questions = await Question.findAll({ where: { quizzId } });

        const answers = await Answer.findAll({
            where: {
                QuestionId: questions.map(q => q.id),
                StudentId: userId
            }
        });

        const completed = answers.length === questions.length;
        res.status(200).json({ completed });
    } catch (error) {
        console.error('Erreur lors de la récupération du statut des réponses :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du statut des réponses.' });
    }
});

router.get('/last-results', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Récupérer toutes les réponses de l'utilisateur
        const answers = await Answer.findAll({
            where: { StudentId: userId },
            include: [
                {
                    model: Question,
                    attributes: ['QuizzId'],
                    include: [{
                        model: Quizz,
                        attributes: ['id', 'titre']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        // Grouper les réponses par quiz et calculer les notes globales
        const quizResults = {};
        answers.forEach(answer => {
            const quizId = answer.Question.QuizzId;
            const quizTitle = answer.Question.Quizz.titre;
            if (!quizResults[quizId]) {
                quizResults[quizId] = { title: quizTitle, correctAnswers: 0, totalQuestions: 0 };
            }
            quizResults[quizId].totalQuestions++;
            if (answer.isAccepted) {
                quizResults[quizId].correctAnswers++;
            }
        });

        // Calculer les notes globales pour chaque quiz
        const results = Object.keys(quizResults).map(quizId => {
            const { title, correctAnswers, totalQuestions } = quizResults[quizId];
            const score = (correctAnswers / totalQuestions) * 20; // Note sur 20
            return { quizId, title, correctAnswers, totalQuestions, score };
        });

        res.status(200).json({ results });
    } catch (error) {
        console.error('Erreur lors de la récupération des derniers résultats de quiz :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des derniers résultats de quiz.' });
    }
});

router.get('/average-last', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Récupérer les 5 derniers quiz créés par le professeur
        const quizzes = await Quizz.findAll({
            where: { CreatedBy: userId },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        if (quizzes.length === 0) {
            return res.status(200).json({ averages: [] });
        }

        // Récupérer les réponses associées à ces quiz
        const quizIds = quizzes.map(quiz => quiz.id);
        const answers = await Answer.findAll({
            where: {
                '$Question.QuizzId$': quizIds,
                isAccepted: { [Op.not]: null }
            },
            include: [
                { model: Question, attributes: ['QuizzId'] }
            ]
        });

        // Grouper les réponses par quiz et calculer les notes globales
        const quizResults = {};
        answers.forEach(answer => {
            const quizId = answer.Question.QuizzId;
            if (!quizResults[quizId]) {
                quizResults[quizId] = { correctAnswers: 0, totalQuestions: 0 };
            }
            quizResults[quizId].totalQuestions++;
            if (answer.isAccepted) {
                quizResults[quizId].correctAnswers++;
            }
        });

        // Calculer les moyennes pour chaque quiz
        const averages = quizzes.map(quiz => {
            const result = quizResults[quiz.id] || { correctAnswers: 0, totalQuestions: 0 };
            const average = result.totalQuestions > 0 ? (result.correctAnswers / result.totalQuestions) * 20 : 0;
            return { title: quiz.titre, average: average.toFixed(2) };
        });

        res.status(200).json({ averages });
    } catch (error) {
        console.error('Erreur lors de la récupération des moyennes des derniers quiz :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des moyennes des derniers quiz.' });
    }
});



module.exports = router;
