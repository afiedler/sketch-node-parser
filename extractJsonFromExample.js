var sqlite3 = require('sqlite3');
var bplist = require('bplist');
var _ = require('lodash');
var fs = require('fs');

var db = new sqlite3.Database('./example/example.sketch', sqlite3.OPEN_READONLY);

db.each('SELECT * FROM payload', function(err, row) {
  if(err) {
    console.log(err);
    process.exit(-1);
  }

  bplist.parseBuffer(row.value, function(err, results) {
    if(err) {
      console.log(err);
      process.exit(-1);
    }

    var objects = results[0].$objects;

    fs.writeFileSync('./example/objects.json', JSON.stringify(objects, null, 2));

    var classes = _.compact(_.map(objects, (o, idx) => {
      if(o.$classname) {
        return {
          classname: o.$classname,
          index: idx,
          fields: [],
          examples: []
        };
      }
    }));

    _.each(objects, (o, idx) => {
      if(o.$class) {
        var thisClass = _.find(classes, (c) => c.index === o.$class);
        var fields = Object.keys(o);
        thisClass.fields = _.union(thisClass.fields, fields);
        var p = JSON.parse(JSON.stringify(o));
        p.$$id = idx;
        thisClass.examples.push(p);
      }
    });

    classes = _.reduce(classes, (obj, c) => {
      if(!obj[c.classname]) { obj[c.classname] = {}; }
      obj[c.classname].index = c.index;
      obj[c.classname].fields = _.union(obj[c.classname].fields, c.fields);
      obj[c.classname].examples = _.union(obj[c.classname].examples, c.examples);
      return obj;
    }, {});

    fs.writeFileSync('./example/classes.json', JSON.stringify(classes, null, 2));

  });

});
