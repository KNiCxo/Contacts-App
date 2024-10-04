// Get required modules for SQL
const mysql = require('mysql');
const dotenv = require('dotenv');

// Enable dotenv
dotenv.config();

// Create instance for MySQL
let instance = null;

// Create connection object
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + connection.state);
});


// SQL query functions
class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  // Creates tables based on name that was given
  async createList(name) {
    try {
      // Creates main table
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

      // Creates table for phone numbers
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

      // Creates table for email
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

  // Adds contact information to proper tables
  async addContact(contactInfo) {
    try {
      // Adds primary information to main table
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
      
      // Get primary key from main table entry for use in phone and email tables
      const insertId = defaultRow.insertId;

      // Iterates through phone number objects and adds to phone number table
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

      // Waits for all rows to be added before continuing
      await Promise.all(phoneNumberRows);

      // Iterates through email objects and adds to email table
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

      // Waits for all rows to be added before continuing
      await Promise.all(phoneNumberRows);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;