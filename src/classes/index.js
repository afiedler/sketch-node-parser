'use strict';

const atob = require('atob');

const classes = module.exports = {};

const classFactory = (opts) => {
  const literals = Array.isArray(opts.literals) ? opts.literals : null;
  const allLiterals = opts.literals === true;

  const refs = Array.isArray(opts.refs) ? opts.refs : null;
  const allRefs = opts.refs === true;

  return function(obj, archive) {

    if (allLiterals) {
      Object.assign(this, obj);
    } else if (literals) {
      literals.forEach(key => this[key] = obj[key]);
    }

    if (allRefs) {
      archive.deserializeAll(obj, this, literals);
    } else if (refs) {
      refs.forEach(key => this[key] = archive.deserializeByRef(obj[key]));
    }

  };
};

/**
 * This is the top-level document object, or "root".
 */
classes.MSImmutableDocumentData = classFactory({
  literals: [
    'currentPageIndex',
  ],
  refs: true,
});

/**
 * obj has the format: { "NS.object.#": <ref> }, where # is the array index
 * and <ref> is a reference to the object at that index
 */
classes.NSMutableArray = function(obj, archive) {
  const array = [];

  Object.keys(obj).forEach(k => {
    if (k === '$class') return;
    var match = /NS.object.(\d+)/.exec(k);
    var idx;
    if(match) {
      idx = parseInt(match[1]);
    } else {
      throw new Error('invalid array index');
    }
    array[idx] = archive.deserializeByRef(obj[k]);
  });

  return array;
};

// XXX should NSArray be mutable? maybe it doesn't matter
classes.NSArray = classes.NSMutableArray;

// an immutable array has a reference to an NSArray
classes.MSImmutableArray = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};

/**
 * A serialized NSDictionary has the format:
 *
 * {"NS.key.#": <ref>, "NS.object.#": <ref>}
 *
 * where each pair of key and object references another object.
 */
classes.NSDictionary = function(obj, archive) {
  const KEY_PATTERN = /^NS\.key.(\d+)$/;
  const OBJ_PREFIX = 'NS.object.';

  Object.keys(obj).forEach(k => {
    const match = k.match(KEY_PATTERN);
    if (match) {
      const keyIndex = obj[OBJ_PREFIX + match[1]];
      const key = archive.deserializeByRef(keyIndex);
      const valIndex = obj[k];
      const val = archive.deserializeByRef(valIndex);
      this[key] = val;
    }
  });
};

/**
 * NSColor is seralized as a buffer of base64 characters and a null
 * terminator. Its string form looks like:
 *
 * "<red> <green> <blue>( <alpha>)"
 */
classes.NSColor = function(data, archive) {
  const str = atob(data.NSRGB.toString('base64'));
  const parts = str.substr(0, str.length - 1)
    .split(' ')
    .map(Number);
  const hasAlpha = parts.length === 4;
  this.red = parts[0];
  this.green = parts[1];
  this.blue = parts[2];
  this.alpha = hasAlpha ? parts[3] : 1;
};

classes.MSImmutableImageCollection = classFactory({
  refs: ['images'],
});

classes.MSImmutableAssetCollection = classFactory({
  refs: ['gradients', 'colors', 'imageCollection', 'images'],
});

classes.MSImmutableSharedLayerStyleContainer = classFactory({
  refs: ['objects'],
});

classes.MSImmutableSharedLayerContainer = classFactory({
  refs: ['objects'],
});

classes.MSImmutableSharedLayerTextStyleContainer = classFactory({
  refs: ['objects'],
});

classes.MSImmutableExportOptions = classFactory({
  literals: ['shouldTrim'],
  refs: ['sizes', 'includedLayerIds', 'layerOptions'],
});

classes.MSImmutableRect = classFactory({
  literals: ['x', 'y', 'width', 'height', 'constrainProportions'],
});

classes.MSImmutableStyle = classFactory({
  literals: [
    'endDecorationType',
    'miterLimit',
    'startDecorationType',
  ],
  refs: true
});

classes.MSImmutableColor = classFactory({
  literals: ['red', 'green', 'blue', 'alpha'],
});

classes.MSImmutableStyleBorder = classFactory({
  literals: [
    'fillType',
    'isEnabled',
    'position',
    'thickness',
  ],
  refs: [
    'color',
  ],
});

classes.MSImmutableBorderStyleCollection = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};

classes.MSImmutableStyleFill = classFactory({
  literals: [
    'isEnabled',
    'noiseIntensity',
    'patternTileScale',
  ],
  refs: [
    'color',
    'image',
    'fillType',
    'patternFillType',
  ],
});

classes.MSImmutableFillStyleCollection = function(obj, archive) {
  this.array =  archive.deserializeByRef(obj.array_do);
};

classes.MSImmutableCurvePoint = classFactory({
  literals: [
    'cornerRadius',
    'curveMode',
    'hasCurveForm',
    'hasCurveTo',
  ],
  refs: [
    'curveFrom',
    'curveTo',
    'point',
  ],
});

classes.MSImmutableShapePath = classFactory({
  literals: ['isClosed'],
  refs: ['points'],
});

classes.MSImmutableRectangleShape = classFactory({
  literals: [
    'booleanOperation',
    'do_objectID',
    'edited',
    'fixedRadius',
    'hasConvertedToNewRoundCorners',
    'isFlippedHorizontal',
    'isFlippedVertical',
    'isLocked',
    'isVisible',
    'layerListExpandedType',
    'name',
    'nameIsFixed',
    'originalObjectId',
    'rotation',
    'shouldBreakMaskChain',
  ],
  refs: [
    'exportOptions',
    'frame',
    'path',
    'userInfo',
  ],
});

classes.MSImmutableShapeGroup = classFactory({
  literals: [
    'clippingMaskMode',
    'do_objectID',
    'hasClickThrough',
    'hasClippingMask',
    'isFlippedHorizontal',
    'isFlippedVertical',
    'isLocked',
    'isVisible',
    'layerListExpandedType',
    'name',
    'nameIsFixed',
    'originalObjectID',
    'rotation',
    'shouldBreakMaskChain',
    'windingRule',
  ],
  refs: [
    'frame',
    'exportOptions',
    'layers',
    'sharedObjectID',
    'style',
    'userInfo',
  ],
});

classes.MSImmutableRulerData = classFactory({
  refs: true
});

classes.MSImmutablePage = classFactory({
  literals: [
    'do_objectID',
    'hasClickThrough',
    'isFlippedHorizontal',
    'isFlippedVertical',
    'isLocked',
    'isVisible',
    'nameIsFixed',
    'rotation',
    'shouldBreakMaskChain',
    'zoomValue',
  ],
  refs: true,
});
