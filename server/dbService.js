const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async createDefault() {
    try {
      const friends = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE Friends (
          ContactIs int AUTO_INCREMENT PRIMARY KEY,
          AviPath varchar(255),
          FirstName varchar(100),
          LastName varchar(100),
          Company varchar(100),
          Birthday date,
          Address varchar(100),
          Note varchar(1000)
        );`

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });

      });

      const friendsNumbers = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE FriendsNumbers (
          ContactId int PRIMARY KEY,
          Number varchar(30)
        );`

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });

      });

      const friendsEmails = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE FriendsEmails (
          ContactId int PRIMARY KEY,
          Email varchar(50)
        );`

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });

      });

      return response;
    } catch(error) {
      console.log(error);
    }
  }

  async insertNewName() {
    try {
      const testObj = JSON.stringify({
        name: 'nick',
        name2: 'caliwag'
      });

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO Friends (LastName, FirstName, Address, City) VALUES (?, ?, ?, ?);';

        connection.query(query, [testObj, '1', '1', '1'], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      }); 

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;