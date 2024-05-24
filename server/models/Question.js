module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        QuizzId: {  // Notez le 'U' majuscule
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Question.associate = models => {
        Question.belongsTo(models.Quizz, { foreignKey: 'QuizzId' });
        Question.belongsTo(models.TypeQuestion, { foreignKey: 'TypeQuestionId' }); // Une question appartient à un type de question
    };

    return Question;
};
