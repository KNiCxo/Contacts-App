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

  async createList(name) {
    try {
      const list = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ${name} (
                       ContactId INT AUTO_INCREMENT PRIMARY KEY,
                       AviPath VARCHAR(255),
                       FirstName VARCHAR(100),
                       LastName VARCHAR(100),
                       Company VARCHAR(100),
                       Birthday DATE,
                       Address VARCHAR(100),
                       Note VARCHAR(1000)
                      );`;

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      const listNumbers = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ${name}Numbers (
                       NumberId INT AUTO_INCREMENT PRIMARY KEY,
                       ContactId INT,
                       Type VARCHAR(6),
                       Number VARCHAR(100)
                      );`;

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      const listEmails = await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ${name}Emails (
                       EmailId INT AUTO_INCREMENT PRIMARY KEY,
                       ContactId INT,
                       Email VARCHAR(100)
                      );`;

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addContact(contactInfo) {
    try {
      const defaultRow = await new Promise((resolve, reject) => {
        const query = `INSERT INTO ${contactInfo.listName}
                       (AviPath, FirstName, LastName, Company, Birthday, Address, Note)
                       VALUES (?, ?, ?, ?, ?, ?, ?);`;
        
        connection.query(query, 
          [contactInfo.fileName, contactInfo.firstName, contactInfo.lastName, contactInfo.company,
           contactInfo.birthday, contactInfo.address, contactInfo.note],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });
      
      const insertId = defaultRow.insertId;

      const phoneNumberRows = contactInfo.phoneNumbers.map(async (number) => {
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ${contactInfo.listName}Numbers
                          (ContactId, Type, Number)
                          VALUES (?, ?, ?);`;
          
          connection.query(query, [insertId, number.type, number.number], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      await Promise.all(phoneNumberRows);

      const emailRows = contactInfo.emails.map(async (email) => {
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ${contactInfo.listName}Emails
                          (ContactId, Email)
                          VALUES (?, ?);`;
          
          connection.query(query, [insertId, email], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      await Promise.all(phoneNumberRows);
    } catch (error) {
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