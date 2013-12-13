/**
 * Created by sbering on 12/12/13.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Session', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            unique: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            get: function() {
                var start = this.getDataValue('startDate'),
                    end = this.getDataValue('endDate'),
                    now = new Date(),
                    started = start <= now,
                    ended = end !== null && end >= now;
                return started && !ended;
            },
            set: function(v) {
                // don't update anything
            }
        }
    });
};