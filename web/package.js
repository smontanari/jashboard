var _ = require("underscore");
var UglifyJS = require("uglify-js");
var Walk = require("walk");

var fileNameExclusions = ['loader.js', 'jashboard_loader.js'];
var fileMaskExclusions = /^\..*|.+_plugin\.js$/; // exclude '.DS_Store' and any other junk
var files = [];
var walker  = Walk.walk('./jashboard', { followLinks: false });

walker.on('file', function(root, stat, next) {
  var filename = stat.name;
  var matchExclusion = fileMaskExclusions.exec(filename);
  if (!matchExclusion && !_.contains(fileNameExclusions, filename)) {
    files.push(root + '/' + filename);
  }
  next();
});
walker.on('end', function() {
  var result = UglifyJS.minify(files, {mangle: {except: ['$routeProvider', '$locationProvider', '$log']}});
  console.log(result.code);
});
