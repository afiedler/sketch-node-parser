'use strict';
const sketchClasses = require('./classes');

module.exports = class MSUnarchiver {

  constructor(archive) {
    this._archive = archive;
    this._root = this._archive.$top.root;
  }

  get root() {
    return this.deserializeByRef(this._root);
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
        return this.deserializeAll(obj, {'$classname': classname});
      }
    } else if (obj === '$null') {
      return null;
    } else if (typeof obj === 'string') {
      return obj;
    } else {
      throw new Error('not able to deserialize: ' + JSON.stringify(obj));
    }
  }

  deserializeByRef(ref) {
    return this.deserialize(this.getByRef(ref));
  }

  deserializeAll(obj, into) {
    const dest = into || {};
    Object.keys(obj).forEach(key => {
      if (key.charAt(0) !== '$') {
        const indexOrValue = obj[key];
        dest[key] = (indexOrValue === this._root)
          ? indexOrValue
          : this.deserializeByRef(val);
      }
    });
    return dest;
  }
};
