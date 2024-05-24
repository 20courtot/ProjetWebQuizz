module.exports = (sequelize, DataTypes) => {
    const Groupe = sequelize.define("Groupe", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        CreatedBy: {  // Notez le 'U' majuscule
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Groupe.associate = models => {
        // L'association avec User
        Groupe.belongsTo(models.User, { foreignKey: 'CreatedBy' });
        Groupe.hasMany(models.Quizz, { foreignKey: 'GroupeId' });

        // L'association avec UserGroupe
        Groupe.belongsToMany(models.User, { through: 'UserGroupe', as: 'Members' });
    };

    return Groupe;
};
