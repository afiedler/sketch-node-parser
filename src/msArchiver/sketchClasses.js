var ObjectAssign = require('object-assign');
var _ = require('lodash');

var sketchClasses = module.exports = {};

sketchClasses.MSImmutableDocumentData = function(obj, archive) { ObjectAssign(this, obj); };

/*
 * obj has the format: { "NS.object.#": <ref> }, where # is the array index and <ref> is a reference to the object at
 * that index
 */
sketchClasses.NSMutableArray = function(obj, archive) {
  // We want NSMutableArray to be Array-like
  var ret = Object.create(Array.prototype);

  _.each(Object.keys(obj), (k) => {
    if(k === '$class') return;
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


sketchClasses.MSImmutableArray = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};
sketchClasses.NSDictionary = function(obj, archive) {

};
sketchClasses.MSImmutableImageCollection = function(obj, archive) {
  this.images = obj.images;
};
sketchClasses.MSImmutableAssetCollection = function(obj, archive) {
  this.gradients = obj.gradients;
  this.colors = obj.colors;
  this.imageCollection = obj.imageCollection;
  this.images = obj.images;
};
sketchClasses.MSImmutableSharedLayerStyleContainer = function(obj, archive) {
  this.objects = obj.objects;
};
sketchClasses.MSImmutableSharedLayerContainer = function(obj, archive) {
  this.objects = obj.objects;
};
sketchClasses.MSImmutableSharedLayerTextStyleContainer = function(obj, archive) {
  this.objects = obj.objects;
};
sketchClasses.MSImmutableExportOptions = function(obj, archive) {
  this.sizes = obj.sizes;
  this.includedLayerIds = obj.includedLayerIds;
  this.layerOptions = obj.layerOptions;
  this.shouldTrim = obj.shouldTrim;
};
sketchClasses.MSImmutableRect = function(obj, archive) {
  this.y = obj.y;
  this.x = obj.x;
  this.constrainProportions = obj.constrainProportions;
  this.width = obj.width;
  this.height = obj.height;
};
sketchClasses.MSImmutableStyle = function(obj, archive) {
  this.startDecorationType = obj.startDecorationType;
  this.sharedObjectId = obj.sharedObjectId;
  this.miterLimit = obj.miterLimit;
  this.textStyle = obj.textStyle;
  this.startDecorationType = obj.startDecorationType;
  this.endDecorationType = obj.endDecorationType;
  this.borders = obj.borders;
  this.fills = obj.fills;
};
sketchClasses.MSImmutableColor = function(obj, archive) {
  this.red = obj.red;
  this.blue = obj.blue;
  this.green = obj.green;
  this.alpha = obj.alpha;
};
sketchClasses.MSImmutableStyleBorder = function(obj, archive) {
  this.thickness = obj.thickness;
  this.fillType = obj.fillType;
  this.isEnabled = obj.isEnabled;
  this.position = obj.position;
  this.color = archive.deserializeByRef(obj.color);
};
sketchClasses.MSImmutableBorderStyleCollection = function(obj, archive) {
  return archive.deserializeByRef(obj.array_do);
};
sketchClasses.MSImmutableStyleFill = function(obj, archive) {
  this.color = archive.deserializeByRef(obj.color);
  this.image = archive.deserializeByRef(obj.image);
  this.fillType = archive.deserializeByRef(obj.fillType);
  this.noiseIntensity = obj.noiseIntensity;
  this.patternFillType = obj.patternFillType;
  this.patternTileScale = obj.patternTileScale;
  this.isEnabled = obj.isEnabled;
};
sketchClasses.MSImmutableFillStyleCollection = function(obj, archive) {
  this.array =  archive.deserializeByRef(obj.array_do);
};
sketchClasses.MSImmutableCurvePoint = function(obj, archive) {
  this.hasCurveForm = obj.hasCurveForm;
  this.curveMode = obj.curveMode;
  this.point = archive.deserializeByRef(obj.point);
  this.curveFrom = archive.deserializeByRef(obj.curveFrom);
  this.curveTo = archive.deserializeByRef(obj.curveTo);
  this.hasCurveTo = obj.hasCurveTo;
  this.cornerRadius = obj.cornerRadius;
};
sketchClasses.MSImmutableShapePath = function(obj, archive) {
  this.points = archive.deserializeByRef(obj.points);
  this.isClosed = obj.isClosed;
};
sketchClasses.MSImmutableRectangleShape = function(obj, archive) {
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
sketchClasses.MSImmutableShapeGroup = function(obj, archive) {
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
sketchClasses.MSImmutableRulerData = function(obj, archive) {
  this.base = obj.base;
  this.guides = obj.guides;
};
sketchClasses.MSImmutablePage = function(obj, archive) {
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

sketchClasses.MSImmutableDocumentData = function(obj, archive) {
  this.assets = archive.deserializeByRef(obj.assets);
  this.currentPageIndex = obj.currentPageIndex;
  this.layerStyles = archive.deserializeByRef(obj.layerStyles);
  this.pages = archive.deserializeByRef(obj.pages);
  this.enableSliceInteraction = obj.enableSliceInteraction;
  this.layerTextStyles = archive.deserializeByRef(obj.layerTextStyles);
  this.enableLayerInteraction = obj.enableLayerInteraction;
  this.layerSymbols = archive.deserializeByRef(obj.layerSymbols);
};
