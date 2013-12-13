/**
 * Created by sbering on 12/11/13.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserCredential', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: 'User',
            referencesKey: 'id'
        },
        username: DataTypes.STRING,
        passwordhash: DataTypes.STRING,
        passwordsalt: DataTypes.STRING
    });
};