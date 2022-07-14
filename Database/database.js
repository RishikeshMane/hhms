var mysql = require('mysql2');

var connection = mysql.createPool({
    connectionLimit: 10,
    host:'162.240.56.117',
    user:'myuser',
    password:'KGiI)[!5M]HIl2Eo',
    database:'HMS'
    
});

module.exports = connection;
