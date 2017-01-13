'use strict';
const sketchClasses = require('./classes');

module.exports = class MSUnarchiver {

  constructor(archive) {
    this._archive = archive;
  }

  get top() {
    return this.deserializeByRef(this._archive.$top.root);
  }

  getByRef(ref) {
    return this._archive.$objects[ref];
  }

  deserialize(obj) {
    if (obj.$class) {
      var classname = this.getByRef(obj.$class).$classname;
      if (classname in sketchClasses) {
        return new sketchClasses[classname](obj, this);
      } else {
        console.warn('no deserializer class for:', classname);
        return obj;
      }
    } else if (obj === '$null') {
      return null;
    } else if (typeof obj === 'string') {
      return obj;
    } else {
      throw new Error('not able to deserialize');
    }
  }

  deserializeByRef(ref) {
    return this.deserialize(this.getByRef(ref));
  }
};
