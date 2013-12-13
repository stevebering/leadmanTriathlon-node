/**
 * Created by sbering on 12/12/13.
 */

module.exports = {
    development: {
        db: {
            host: 'localhost',
            database: 'leadman',
            username: 'root',
            password: '1SecureMS'
        },
        googleOpenId: {
            callBackUrl: ''
        }
    },
    production: {
        db: {
            host: 'someotherserver',
            database: 'leadman',
            username: 'someuser',
            password: 'password'
        }
    }
};