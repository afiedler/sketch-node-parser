'use strict';

const classes = module.exports = {};

const classFactory = (literals, refs) => {
  return function(obj, archive) {
    if (literals === true) {
      Object.assign(this, obj);
    } else if (Array.isArray(literals)) {
      literals.forEach(key => this[key] = obj[key]);
    }
    if (Array.isArray(refs)) {
      refs.forEach(key => this[key] = archive.deserializeByRef(obj[key]));
    }
  };
};

classes.MSImmutableDocumentData = function(obj, archive) {
  archive.deserializeAll(obj, this);
};

/*
 * obj has the format: { "NS.object.#": <ref> }, where # is the array index and
 * <ref> is a reference to the object at that index
 */
classes.NSMutableArray = function(obj, archive) {
  // We want NSMutableArray to be Array-like
  const ret = Object.create(Array.prototype);

  Object.keys(obj).forEach(k => {
    if (k === '$class') return;
    var match = /NS.object.(\d+)/.exec(k);
    var idx;
    if(match) {
      idx = parseInt(match[1]);
    } else {
      throw new Error('invalid array index');
    }
    ret[idx] = archive.deserializeByRef(obj[k]);
  });

  return ret;
};


classes.MSImmutableArray = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};

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

classes.MSImmutableImageCollection = function(obj, archive) {
  this.images = obj.images;
};

classes.MSImmutableAssetCollection = function(obj, archive) {
  this.gradients = archive.deserializeByRef(obj.gradients);
  this.colors = archive.deserializeByRef(obj.colors);
  this.imageCollection = archive.deserializeByRef(obj.imageCollection);
  this.images = archive.deserializeByRef(obj.images);
};

classes.MSImmutableSharedLayerStyleContainer = function(obj, archive) {
  this.objects = obj.objects;
};

classes.MSImmutableSharedLayerContainer = function(obj, archive) {
  this.objects = obj.objects;
};

classes.MSImmutableSharedLayerTextStyleContainer = function(obj, archive) {
  this.objects = obj.objects;
};

classes.MSImmutableExportOptions = function(obj, archive) {
  this.sizes = obj.sizes;
  this.includedLayerIds = obj.includedLayerIds;
  this.layerOptions = obj.layerOptions;
  this.shouldTrim = obj.shouldTrim;
};

classes.MSImmutableRect = function(obj, archive) {
  this.y = obj.y;
  this.x = obj.x;
  this.constrainProportions = obj.constrainProportions;
  this.width = obj.width;
  this.height = obj.height;
};

classes.MSImmutableStyle = function(obj, archive) {
  this.startDecorationType = obj.startDecorationType;
  this.sharedObjectId = obj.sharedObjectId;
  this.miterLimit = obj.miterLimit;
  this.textStyle = obj.textStyle;
  this.startDecorationType = obj.startDecorationType;
  this.endDecorationType = obj.endDecorationType;
  this.borders = obj.borders;
  this.fills = obj.fills;
};

classes.MSImmutableColor = function(obj, archive) {
  this.red = obj.red;
  this.blue = obj.blue;
  this.green = obj.green;
  this.alpha = obj.alpha;
};

classes.MSImmutableStyleBorder = function(obj, archive) {
  this.thickness = obj.thickness;
  this.fillType = obj.fillType;
  this.isEnabled = obj.isEnabled;
  this.position = obj.position;
  this.color = archive.deserializeByRef(obj.color);
};

classes.MSImmutableBorderStyleCollection = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};

classes.MSImmutableStyleFill = function(obj, archive) {
  this.color = archive.deserializeByRef(obj.color);
  this.image = archive.deserializeByRef(obj.image);
  this.fillType = archive.deserializeByRef(obj.fillType);
  this.noiseIntensity = obj.noiseIntensity;
  this.patternFillType = obj.patternFillType;
  this.patternTileScale = obj.patternTileScale;
  this.isEnabled = obj.isEnabled;
};

classes.MSImmutableFillStyleCollection = function(obj, archive) {
  this.array =  archive.deserializeByRef(obj.array_do);
};

classes.MSImmutableCurvePoint = function(obj, archive) {
  this.hasCurveForm = obj.hasCurveForm;
  this.curveMode = obj.curveMode;
  this.point = archive.deserializeByRef(obj.point);
  this.curveFrom = archive.deserializeByRef(obj.curveFrom);
  this.curveTo = archive.deserializeByRef(obj.curveTo);
  this.hasCurveTo = obj.hasCurveTo;
  this.cornerRadius = obj.cornerRadius;
};

classes.MSImmutableShapePath = function(obj, archive) {
  this.points = archive.deserializeByRef(obj.points);
  this.isClosed = obj.isClosed;
};

classes.MSImmutableRectangleShape = function(obj, archive) {
  this.originalObjectId = obj.originalObjectId;
  this.isFlippedHorizontal = obj.isFlippedHorizontal;
  this.hasConvertedToNewRoundCorners = obj.hasConvertedToNewRoundCorners;
  this.rotation = obj.rotation;
  this.frame = obj.originalObjectId;
  this.do_objectID = obj.do_objectID;
  this.layerListExpandedType = obj.layerListExpandedType;
  this.exportOptions = obj.exportOptions;
  this.edited = obj.edited;
  this.path = obj.path;
  this.isFlippedVertical = obj.isFlippedVertical;
  this.nameIsFixed = obj.nameIsFixed;
  this.name = obj.name;
  this.isVisible = obj.isVisible;
  this.userInfo = obj.userInfo;
  this.isLocked = obj.isLocked;
  this.shouldBreakMaskChain = obj.shouldBreakMaskChain;
  this.fixedRadius = obj.fixedRadius;
  this.booleanOperation = obj.booleanOperation;
};

classes.MSImmutableShapeGroup = function(obj, archive) {
  this.originalObjectID = obj.originalObjectID;
  this.isFlippedHorizontal = obj.isFlippedHorizontal;
  this.style = obj.style;
  this.rotation = obj.rotation;
  this.frame = obj.frame;
  this.hasClickThrough = obj.hasClickThrough;
  this.layerListExpandedType = obj.layerListExpandedType;
  this.exportOptions = obj.exportOptions;
  this.windingRule = obj.windingRule;
  this.do_objectID = obj.do_objectID;
  this.isFlippedVertical = obj.isFlippedVertical;
  this.clippingMaskMode = obj.clippingMaskMode;
  this.nameIsFixed = obj.nameIsFixed;
  this.layers = obj.layers;
  this.isVisible = obj.isVisible;
  this.hasClippingMask = obj.hasClippingMask;
  this.name = obj.name;
  this.userInfo = obj.userInfo;
  this.isLocked = obj.isLocked;
  this.shouldBreakMaskChain = obj.shouldBreakMaskChain;
  this.sharedObjectID = obj.sharedObjectID;
};

classes.MSImmutableRulerData = function(obj, archive) {
  this.base = obj.base;
  this.guides = obj.guides;
};

classes.MSImmutablePage = function(obj, archive) {
  this.originalObjectId = obj.originalObjectId;
  this.isFlippedHorizontal = obj.isFlippedHorizontal;
  this.style = archive.deserializeByRef(obj.style);
  this.rotation = obj.rotation;
  this.frame = archive.deserializeByRef(obj.frame);
  this.hasClickThrough = obj.hasClickThrough;
  this.horizontalRulerData = archive.deserializeByRef(obj.horizontalRulerData);
  this.exportOptions = archive.deserializeByRef(obj.exportOptions);
  this.layerListExpandedType = archive.deserializeByRef(obj.layerListExpandedType);
  this.zoomValue = obj.zoomValue;
  this.do_objectID = obj.do_objectID;
  this.verticalRulerData = archive.deserializeByRef(obj.verticalRulerData);
  this.isFlippedVertical = obj.isFlippedVertical;
  this.nameIsFixed = obj.nameIsFixed;
  this.name = archive.deserializeByRef(obj.name);
  this.layers = archive.deserializeByRef(obj.layers);
  this.isVisible = obj.isVisible;
  this.userInfo = archive.deserializeByRef(obj.userInfo);
  this.grid = archive.deserializeByRef(obj.grid);
  this.isLocked = obj.isLocked;
  this.userInfo = obj.userInfo;
  this.scrollOrigin = archive.deserializeByRef(obj.scrollOrigin);
  this.layout = archive.deserializeByRef(obj.layout);
  this.shouldBreakMaskChain = obj.shouldBreakMaskChain;
  this.sharedObjectID = obj.sharedObjectID;
};

classes.MSImmutableDocumentData = function(obj, archive) {
  this.assets = archive.deserializeByRef(obj.assets);
  this.currentPageIndex = obj.currentPageIndex;
  this.layerStyles = archive.deserializeByRef(obj.layerStyles);
  this.pages = archive.deserializeByRef(obj.pages);
  this.enableSliceInteraction = obj.enableSliceInteraction;
  this.layerTextStyles = archive.deserializeByRef(obj.layerTextStyles);
  this.enableLayerInteraction = obj.enableLayerInteraction;
  this.layerSymbols = archive.deserializeByRef(obj.layerSymbols);
};
