const sqlite3 = require('sqlite3');
const bplist = require('bplist');
const MSUnarchiver = require('./MSUnarchiver');

/**
 * SQLite queries for .sketch database files
 */
const query = {
  main: "SELECT * FROM payload WHERE name = 'main'"
};

/**
 * Open a file as a SQLite database, parse its contents, and close the db
 * when finished.
 *
 * @param {String} path the path to the .sketch filename
 * @return {Promise}
 */
const parseFile = (path) => {
  const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY);
  return parseDatabase(db).always(() => db.close());
};

/**
 * Extract data from a sqlite3.Database instance. The returned promise will
 * resolve with an object literal containing an "archive" property that is an
 * MSUnarchiver instance.
 *
 * @param {sqlite3.Database} db
 * @return {Promise}
 */
const parseDatabase = (db) => {
  return new Promise((resolve, reject) => {

    db.get(query.main, (error, row) => {
      if (error) return reject(error);
      bplist.parseBuffer(row.value, (error, results) => {
        if (error) return reject(error);
        resolve({
          archive: new MSUnarchiver(results[0])
        });
      });
    });

  });
};

module.exports = {
  database: parseDatabase,
  file: parseFile,
};
