var sketchClasses = require('./sketchClasses');
const _ = require('lodash');

function MSUnarchiver(archive) {
  this._archive = archive;
}

MSUnarchiver.prototype.top = function() {
  return this.deserializeByRef(this._archive.$top.root);
};

MSUnarchiver.prototype.getByRef = function(ref) {
  return this._archive.$objects[ref];
};

MSUnarchiver.prototype.deserialize = function(obj) {
  if(obj.$class) {
    var classname = this.getByRef(obj.$class).$classname;
    return new sketchClasses[classname](obj, this);
  } else if(obj === '$null') {
    return null;
  } else if(_.isString(obj)) {
    return obj;
  } else {
    throw new Error('not able to deserialize');
  }
};

MSUnarchiver.prototype.deserializeByRef = function(ref) {
  return this.deserialize(this.getByRef(ref));
};


module.exports = MSUnarchiver;
