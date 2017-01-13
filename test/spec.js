'use strict';

const assert = require('assert');

const parse = require('..');
const MSUnarchiver = require('../src/MSUnarchiver');
const classes = require('../src/classes');

const EXAMPLE_FILE = require.resolve('../example/example.sketch');
const parsed = parse.file(EXAMPLE_FILE);

describe('parse.file()', function() {

  it('produces a result', function() {
    return parsed.then(result => {
      assert(result, 'object');
      assert.equal(typeof result, 'object');
    });
  });

  it('contains an archive instance', function() {
    return parsed.then(result => {
      assert(result.archive instanceof MSUnarchiver);
    });
  });

});

describe('MSUnarchiver', function() {
  const archive = parsed.then(result => result.archive);

  it('has a root instance of MSImmutableDocumentData', function() {
    return archive.then(a => {
      assert(a.root instanceof classes.MSImmutableDocumentData);
    });
  });

  describe('document root', function() {

    const root = archive.then(a => a.root);

    it('has a pages array', function() {
      return root.then(r => {
        assert(r.pages instanceof Array);
      });
    });

  });

});

