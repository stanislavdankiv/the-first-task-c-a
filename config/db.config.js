const mysql = require('mysql');

function connectDB(configT) {
    let connection = mysql.createConnection({
        host: '192.168.42.16',
        user: 'admin',
        password: 'password',
        database: configT.database
    });
    return connection
}
module.exports.connectDB = connectDB;
