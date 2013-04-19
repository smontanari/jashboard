steal(
  { src: "css/bootstrap.min.css", packaged: false },
  { src: "css/bootstrapSwitch.css", packaged: false },
  { src: "css/jquery-ui/jquery-ui-1.10.1.custom.min.css", packaged: false },
  { src: "jquery", packaged: false }
).then(
  { src: "lib/underscore-min.js", packaged: false },
  { src: "lib/bootstrap.min.js", packaged: false },
  { src: "lib/bootstrapSwitch.js", packaged: false },
  { src: "lib/jquery.blockUI.js", packaged: false },
  { src: "lib/jquery-ui-1.10.1.custom.min.js", packaged: false },
  { src: "lib/jquery.cycle2.min.js", packaged: false },
  { src: "lib/angular.min.js", packaged: false })
.then("steal/less")
.then("css/jashboard.less")
.then("jashboard/jashboard_loader.js")
// .then("jashboard/jashboard.min.js")
.then({ src: "test/funcunit/test_scenario_loader.js", ignore: true });


