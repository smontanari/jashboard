var _ = require("underscore");
var UglifyJS = require("uglify-js");
var Walk = require("walk");

var fileNameExclusions = ['loader.js', 'jashboard_loader.js', 'plugins.js'];
var fileMaskExclusions = /^\..*|.+_plugin\.js$/
var files = [];
var walker  = Walk.walk('./jashboard', { followLinks: false });

walker.on('file', function(root, stat, next) {
  var matchExclusion = fileMaskExclusions.exec(stat.name);
  if (!matchExclusion && !_.contains(fileNameExclusions, stat.name)) {
    files.push(root + '/' + stat.name);
  }
  next();
});

walker.on('end', function() {
  var result = UglifyJS.minify(files, {mangle: {except: ['$routeProvider', '$locationProvider']}});
  console.log(result.code);
});
