module.exports = (sequelize, DataTypes) => {
    const Quizz = sequelize.define("Quizz", {
        titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CreatedBy: {  // Notez le 'U' majuscule
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        GroupeId: {  // Notez le 'U' majuscule
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Quizz.associate = models => {
        Quizz.belongsTo(models.User, { foreignKey: 'CreatedBy' }); // Une relation "quizz" appartient à un "user"
        Quizz.belongsTo(models.Groupe, { foreignKey: 'GroupeId' }); // Une relation "quizz" appartient à un "user"
        Quizz.hasMany(models.Question, { onDelete: 'CASCADE' }); // Un "quizz" peut avoir plusieurs "questions"
    };

    return Quizz;
};
