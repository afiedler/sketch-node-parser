'use strict';

const sketchClasses = require('./classes');
const NULL = '$null';

module.exports = class MSUnarchiver {

  constructor(archive) {
    this._archive = archive;
    this._root = this._archive.$top.root;
    this._refs = new Map();
  }

  get root() {
    return this.deserializeByRef(this._root);
  }

  deserialize(obj, ref) {
    if (obj && obj.$class) {
      const classname = this.getByRef(obj.$class).$classname;
      if (classname in sketchClasses) {
        const instance = new sketchClasses[classname](obj, this);
        // instance.$classname = classname;
        return instance;
      } else {
        console.warn('no deserializer class for:', classname);
        obj.$index = ref;
        obj.$classname = classname;
        return obj;
      }
    } else if (obj === NULL) {
      return null;
    } else if (typeof obj === 'string') {
      return obj;
    } else {
      throw new Error('unable to deserialize: ' + JSON.stringify(obj));
    }
  }

  deserializeByRef(ref) {
    if (this._refs.has(ref)) {
      return this._refs.get(ref);
    }
    const val = this.hasRef(ref)
      ? this.deserialize(this.getByRef(ref))
      : ref;
    this._refs.set(ref, val);
    return val;
  }

  deserializeAll(obj, into, except) {
    const dest = into || {};
    const reject = (except instanceof Set) ? except : new Set();
    if (Array.isArray(except)) {
      except.forEach(v => reject.add(v));
    }
    Object.keys(obj).forEach(key => {
      if (key.charAt(0) !== '$' || reject.has(key)) {
        const indexOrValue = obj[key];
        dest[key] = (indexOrValue === this._root)
          ? indexOrValue
          : this.deserializeByRef(indexOrValue);
      }
    });
    return dest;
  }

  hasRef(ref) {
    return (ref in this._archive.$objects);
  }

  getByRef(ref) {
    return this._archive.$objects[ref];
  }

};
