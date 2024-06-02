module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("Answer", {
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        QuestionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Questions',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        StudentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        isAccepted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: null
        }
    });

    Answer.associate = models => {
        Answer.belongsTo(models.Question, { foreignKey: 'QuestionId' });
        Answer.belongsTo(models.User, { foreignKey: 'StudentId' });
    };

    return Answer;
};
