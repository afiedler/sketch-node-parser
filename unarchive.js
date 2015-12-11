var sqlite3 = require('sqlite3');
var bplist = require('bplist');
var _ = require('lodash');
var MSUnarchiver = require('./src/msArchiver/msUnarchiver');

var db = new sqlite3.Database('./test.sketch', sqlite3.OPEN_READONLY);

db.each('SELECT * FROM payload', function(err, row) {
  if(err) {
    console.log(err);
    process.exit(-1);
  }

  bplist.parseBuffer(row.value, function(err, results) {
    if(err) {
      console.log(err);
      return err;
    }

    var archive = new MSUnarchiver(results[0]);

    // This has the main sketch data structure
    var top = archive.top();

  });

});
