/**
 * Created by sbering on 12/11/13.
 */

var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('leadman', 'root', '1SecureMS', {
        host: "localhost",
        port: 3306,
        dialect: 'mysql',
        define: {
            underscored: false,
            syncOnAssociation: false
        }
    });

var models = [
    'User',
    'UserCredential',
    'Session',
    'Split'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
    m.User.hasOne(m.UserCredential, { foreignKey: "user_id" });
    m.UserCredential.belongsTo(m.User, { foreignKey: 'user_id' });
    m.User.hasMany(m.Split, { foreignKey: 'user_id' });
    m.Session.hasMany(m.Split, { foreignKey: 'session_id' });
    m.Split.belongsTo(m.User, { foreignKey: 'user_id' });
    m.Split.belongsTo(m.Session, { foreignKey: 'session_id' });
})(module.exports);

// export connection
module.exports.sequelize = sequelize;