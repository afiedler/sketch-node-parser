# sketch-node-parser
Parse files from Sketch using pure NodeJS.

This project is just a proof-of-concept, and isn't ready for production use.

## Summary
This program shows how to open a [Sketch](https://sketchapp.com) file and parse it into a Javascript object tree. It
doesn't try to render the file, and doesn't fully model all of the internal data structures. It is just a proof of
concept, showing how an open source Sketch file parser could be created.

### How to use
Look at `parseExample.js` to see how to open and parse a Sketch file.

### Reverse engineering Sketch files
Sketch files are SQLite3 databases, with binary blobs that are binary-encoded Property Lists (an OSX format).

To decode the property lists, you need class definitions for the internal classes. The main challenge in parsing
Sketch files is figuring out these internal classes.

You can see the existing set of classes in `/src/msArchiver/sketchClasses.js`. That list is probably incomplete, but it
isn't too difficult to add more.

### Adding Sketch classes

To add more classes, or fix existing ones, it helps to have a JSON view of the internal property lists. You can create
those by running `extractJsonFromExample.js`.

That creates two files: `classes.json` and `objects.json`. The `classes.json` file is an object with class names as
keys, and lists of class properties and example serialized classes as values.

The `objects.json` file is the internal objects array from the `NSKeyedArchiver`.

Here's an example of a serialized object in `objects.json`:
```json
{
  "$class": 64,
  "color": 63,
  "image": 0,
  "fillType": 0,
  "noiseIntensity": 0,
  "patternFillType": 0,
  "patternTileScale": 1,
  "noiseIndex": 0,
  "isEnabled": true
}
```

Every property is either a primitive (number or boolean) or a reference to another object in the objects array.
References look like integers because they reference the index of the object in the objects array. The `$class` property
is special in that it is a reference to the class definition, which is also an object in the objects array. The trick is
figuring out which are references and which are primitives. You can use the `classes.json` file to see examples of all
serialized objects of a particular class to make this easier.

This particular example is an `MSImmutableStyleFill`, which has this definition (from
`/src/msArchiver/sketchClasses`):
```js
sketchClasses.MSImmutableStyleFill = function(obj, archive) {
  this.color = archive.deserializeByRef(obj.color);
  this.image = archive.deserializeByRef(obj.image);
  this.fillType = archive.deserializeByRef(obj.fillType);
  this.noiseIntensity = archive.deserializeByRef(obj.noiseIntensity);
  this.patternFillType = archive.deserializeByRef(obj.patternFillType);
  this.patternTileScale = archive.deserializeByRef(obj.patternTileScale);
  this.isEnabled = obj.isEnabled;
};
```

Most properties here are references, so `archive.deserializeByRef()` is called to find that reference and deserialize
it. One, `isEnabled`, is a boolean, so it is copied over directly.

### Further Reading
[This blog post](http://www.cclgroupltd.com/geek-post-nskeyedarchiver-files-what-are-they-and-how-can-i-use-them/) has
an excellent description of how Apple's `NSKeyedArchiver` serializes objects.
