module.exports = (sequelize, DataTypes) => {
    const UserGroupe = sequelize.define("UserGroupe", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserId: {
            type: DataTypes.INTEGER,
            primaryKey: false,
        },
        GroupeId: {
            type: DataTypes.INTEGER,
            primaryKey: false,
        }
    });

    UserGroupe.associate = (models) => {
        // L'association avec User
        UserGroupe.belongsTo(models.User, {
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
        });

        // L'association avec Groupe
        UserGroupe.belongsTo(models.Groupe, {
            foreignKey: 'GroupeId',
            onDelete: 'CASCADE'
        });
    };

    return UserGroupe;
};
