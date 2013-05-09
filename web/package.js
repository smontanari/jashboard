console.log("Packaging javascript and css files");

var targetDir = __dirname;
if (process.argv.length == 3) {
  targetDir = process.argv[2];
}

var _ = require("underscore");
var UglifyJS = require("uglify-js");
var Walk = require("walk");
var fs = require('fs');
var less = require('less');

var fileNameExclusions = ['loader.js', 'environment.js', 'jashboard_loader.js'];
// exclude '.DS_Store' and any other junk, plus the *_plugin.js files that use steal to load the other plugin files
var fileMaskExclusions = /^\..*|.+_plugin\.js$/;
var files = [];
var walker  = Walk.walk(__dirname + '/jashboard', { followLinks: false });

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
  fs.writeFileSync(targetDir + '/lib/jashboard.min.js', result.code);
});

var data = fs.readFileSync(__dirname + '/css/jashboard.less', 'utf8');

var parser = new(less.Parser)({
  paths: [__dirname + '/css']
});
parser.parse(data, function (e, tree) {
  var output = tree.toCSS({ compress: true, yuicompress: true });
  fs.writeFileSync(targetDir + '/css/jashboard.min.css', output);
});
