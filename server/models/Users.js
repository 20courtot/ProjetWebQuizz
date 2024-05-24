module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('eleve', 'professeur','admin'),
            allowNull: false,
        },
    });

    User.associate = models => {
        // Association avec Quizz
        User.hasMany(models.Quizz, { foreignKey: 'CreatedBy' });

        // Association avec Groupe
        User.hasMany(models.Groupe, { foreignKey: 'CreatedBy' });
        User.belongsToMany(models.Groupe, { through: 'UserGroupe', as: 'AssociatedGroups' });
    };

    return User;
};
