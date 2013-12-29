/**
 * Created by sbering on 12/13/13.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Split', {
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
        session_id: {
            type: DataTypes.INTEGER,
            references: 'Session',
            referencesKey: 'id'
        },
        name: {
            type: DataTypes.STRING(128),
            unique: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        activeTime: {
            type: DataTypes.DECIMAL(10,2)
        },
        distanceTotal: {
            type: DataTypes.DECIMAL(10,10)
        },
        activityType: {
            type: DataTypes.ENUM,
            values: ['swim', 'bike', 'run']
        },
        unique_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true
        }
    });
};