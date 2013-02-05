steal.dev.log("Loading 3rd party assets");
// 3rd party assets
steal(
  { src: "css/bootstrap.min.css", packaged: false },
  "jquery"
).then(
  { src: 'lib/angular-1.0.2/angular.min.js', packaged: false },
  { src: 'lib/underscore-min.js', packaged: false },
  // { src: 'lib/bootstrap.js', packaged: false }
  { src: 'lib/bootstrap.min.js', packaged: false }
);


steal.dev.log("Loading application files");
// application files
steal('steal/less')
.then("css/jashboard.less")
.then("jashboard/modules.js");

steal({ src: 'test/funcunit/test_scenario_loader.js', ignore: true });
