/**
 * Created by sbering on 12/11/13.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        provider: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        provider_id: DataTypes.STRING(45),
        displayName: DataTypes.STRING(128),
        givenName: DataTypes.STRING(45),
        middleName: DataTypes.STRING(45),
        familyName: DataTypes.STRING(45)
    });
};

