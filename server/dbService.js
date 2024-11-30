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

  // Get all list names from database
  async getLists() {
    try {
      const lists = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM ListTable;`;

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      return lists;
    } catch (error) {
      return '';
    }
  }
  
  // Get all rows from the main table associated with the contact list name
  async getContacts(tableName) {
    try {
      const contacts = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM ??;`;

        connection.query(query, [tableName], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      return contacts;
    } catch (error) {
      console.log(error);
    }
  }

  // Get all rows from the numbers table associated with the contact name
  async getContactNumbers(tableName, id) {
    try {
      const contactNumbers = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM ?? WHERE ContactId = ?;`;

        connection.query(query, [`${tableName}Numbers`, id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      return contactNumbers;
    } catch (error) {
      console.log(error);
    }
  }

  // Get all rows from the numbers table associated with the contact name
  async getContactEmails(tableName, id) {
    try {
      const contactEmails = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM ?? WHERE ContactId = ?;`;

        connection.query(query, [`${tableName}Emails`, id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      return contactEmails;
    } catch (error) {
      console.log(error);
    }
  }

  // Creates table that stores all list names with their contact counts
  async initListTable() {
    try {
      // Creates main table
      await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ListTable (
                       ListId INT AUTO_INCREMENT PRIMARY KEY, 
                       ListName VARCHAR(25), 
                       ContactCount INT
                       );`;

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      // Creates initial list
      await new Promise((resolve, reject) => {
        const query = 'INSERT INTO ListTable (ListName, ContactCount) VALUES ("Contacts", 0);';

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

  // Creates tables based on name that was given
  async createList(tableName) {
    try {
      // Creates main table
      await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ?? (
                       ContactId INT AUTO_INCREMENT PRIMARY KEY,
                       AviPath VARCHAR(255),
                       FirstName VARCHAR(100),
                       LastName VARCHAR(100),
                       Company VARCHAR(100),
                       Birthday VARCHAR(100),
                       Address VARCHAR(100),
                       Note VARCHAR(1000)
                      );`;

        connection.query(query, [tableName], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      // Creates table for phone numbers
      await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ?? (
                       NumberId INT AUTO_INCREMENT PRIMARY KEY,
                       ContactId INT,
                       Type VARCHAR(6),
                       Number VARCHAR(100)
                      );`;

        connection.query(query, [`${tableName}Numbers`], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      // Creates table for email
      await new Promise((resolve, reject) => {
        const query = `CREATE TABLE ?? (
                       EmailId INT AUTO_INCREMENT PRIMARY KEY,
                       ContactId INT,
                       Email VARCHAR(100)
                      );`;

        connection.query(query, [`${tableName}Emails`], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

       // Creates table for email
       await new Promise((resolve, reject) => {
        const query = `INSERT INTO ??
                       (ListName, ContactCount)
                       VALUES (?, 0);`;

        connection.query(query, ['ListTable', tableName], (err, results) => {
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
        const query = `INSERT INTO ??
                       (AviPath, FirstName, LastName, Company, Birthday, Address, Note)
                       VALUES (?, ?, ?, ?, ?, ?, ?);`;
        
        connection.query(query, 
          [contactInfo.ListName, contactInfo.AviPath, contactInfo.FirstName, contactInfo.LastName, contactInfo.Company,
           contactInfo.Birthday, contactInfo.Address, contactInfo.Note],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });
      
      // Get primary key from main table entry for use in phone and email tables
      const insertId = defaultRow.insertId;

      // Iterates through phone number objects and adds to phone number table
      const phoneNumberRows = contactInfo.PhoneNumbers.map(async (number) => {
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ??
                          (ContactId, Type, Number)
                          VALUES (?, ?, ?);`;
          
          connection.query(query, [`${contactInfo.ListName}Numbers`, insertId, number.Type, number.Number], 
          (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      // Waits for all rows to be added before continuing
      await Promise.all(phoneNumberRows);

      // Iterates through email objects and adds to email table
      const emailRows = contactInfo.Emails.map(async (email) => {
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ??
                          (ContactId, Email)
                          VALUES (?, ?);`;
          
          connection.query(query, [`${contactInfo.ListName}Emails`, insertId, email.Email], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      // Waits for all rows to be added before continuing
      await Promise.all(emailRows);

      // Increment list count
      await new Promise ((resolve, reject) => {
        const query = `UPDATE ListTable SET
                       ContactCount = ?
                       WHERE ListName = ?;`;
        
        connection.query(query, [contactInfo.ListCount + 1, contactInfo.ListName], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  // Updates contact information to proper tables
  async updateContact(contactInfo) {
    try {
      // Updates primary information to main table
      await new Promise((resolve, reject) => {
        const query = `UPDATE ?? SET
                       AviPath = ?, 
                       FirstName = ?, 
                       LastName = ?, 
                       Company = ?, 
                       Birthday = ?, 
                       Address = ?, 
                       Note = ?
                       WHERE ContactId = ?;`;
        
        connection.query(query, 
          [contactInfo.ListName, contactInfo.AviPath, contactInfo.FirstName, contactInfo.LastName, contactInfo.Company,
          contactInfo.Birthday, contactInfo.Address, contactInfo.Note, contactInfo.ContactId],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Delete row(s) from numbers table
      await new Promise((resolve, reject) => {
        const query = `DELETE FROM ?? WHERE ContactId = ?`;
        
        connection.query(query, [`${contactInfo.ListName}Numbers`, contactInfo.ContactId],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Iterates through phone number objects and adds to phone number table
      const phoneNumberRows = contactInfo.PhoneNumbers.map(async (number) => {
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ??
                          (ContactId, Type, Number)
                          VALUES (?, ?, ?);`;
          
          connection.query(query, [`${contactInfo.ListName}Numbers`, contactInfo.ContactId, number.Type, number.Number], 
          (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      // Waits for all rows to be added before continuing
      await Promise.all(phoneNumberRows);

      // Delete row(s) from emails table
      await new Promise((resolve, reject) => {
        const query = `DELETE FROM ?? WHERE ContactId = ?`;
        
        connection.query(query, [`${contactInfo.ListName}Emails`, contactInfo.ContactId],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Iterates through phone number objects and adds to phone number table
      const emailRows = contactInfo.Emails.map(async (email) => {
        console.log()
        return new Promise((resolve, reject) => {
          const query = `INSERT INTO ??
                          (ContactId, Email)
                          VALUES (?, ?);`;
          
          connection.query(query, [`${contactInfo.ListName}Emails`, contactInfo.ContactId, email.Email], 
          (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          });
        });
      });

      // Waits for all rows to be added before continuing
      await Promise.all(emailRows);
    } catch (error) {
      console.log(error);
    }
  }

  // Deletes list from database
  async deleteList(tableName) {
    try {
      // Delete entry from ListTable
      await new Promise((resolve, reject) => {
        const query = `DELETE from ListTable WHERE ListName = ?`;

        connection.query(query, [tableName], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      // Delete main, numbers, and emails tables
      await new Promise((resolve, reject) => {
        const query = `DROP TABLE ??, ??, ??`;

        connection.query(query, [tableName, `${tableName}Numbers`, `${tableName}Emails`], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  // Deletes all rows relating to the contact from the tables and 
  // returns AviPath so contact picture can be deleted
  async deleteContact(tableName, id, listData) {
    try {
      // Get AviPath from db
      const aviPath = await new Promise((resolve, reject) => {
        const query = `SELECT AviPath FROM ?? WHERE ContactId = ?;`;

        connection.query(query, [tableName, id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });

      // Delete row from main table
      await new Promise((resolve, reject) => {
        const query = `DELETE FROM ?? WHERE ContactId = ?`;
        
        connection.query(query, [tableName, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Delete row(s) from numbers table
      await new Promise((resolve, reject) => {
        const query = `DELETE FROM ?? WHERE ContactId = ?`;
        
        connection.query(query, [`${tableName}Numbers`, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Delete email(s) from numbers table
      await new Promise((resolve, reject) => {
        const query = `DELETE FROM ?? WHERE ContactId = ?`;
        
        connection.query(query, [`${tableName}Emails`, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          });
      });

      // Decrement list count
      await new Promise ((resolve, reject) => {
        const query = `UPDATE ListTable SET
                       ContactCount = ?
                       WHERE ListName = ?;`;
        
        connection.query(query, [listData.ListCount - 1, tableName], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      })

      // Return AviPath
      return aviPath;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;