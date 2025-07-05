const mysql = require('mysql2/promise');

async function connectDB() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wedding',
    multipleStatements: true, 
  });
}

module.exports = connectDB;
