module.exports = (sequelize, DataTypes) => {
    const TypeQuestion = sequelize.define("TypeQuestion", {
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    TypeQuestion.associate = models => {
        TypeQuestion.hasMany(models.Question, { onDelete: 'CASCADE' }); // Un type de question peut avoir plusieurs questions
    };

    return TypeQuestion;
};
