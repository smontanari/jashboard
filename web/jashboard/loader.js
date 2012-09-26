steal.dev.log("Loading 3rd party assets");
// 3rd party assets
steal(
  { src: "css/bootstrap.min.css", packaged: false },
  { src: "css/jquery-ui/jquery.ui.all.css", packaged: false },
  "jquery"
).then(
  { src: 'lib/jquery-ui-1.8.23.custom.min.js', packaged: false },
  { src: 'lib/angular-1.0.2/angular.js', packaged: false },
  { src: 'lib/bootstrap.min.js', packaged: false }
);

//!steal-remove-start
steal('test/funcunit/jashboard_test_scenario_loader.js');
//!steal-remove-end

steal.dev.log("Loading application files");
// application files
steal('steal/less')
.then("css/jashboard.less")
.then("jashboard/modules.js");


