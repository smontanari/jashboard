steal.dev.log("Loading 3rd party assets");
steal(
  { src: "css/bootstrap.min.css", packaged: false },
  { src: "css/jquery-ui/jquery-ui-1.10.1.custom.min.css", packaged: false },
  "jquery"
).then(
  { src: "lib/angular.min.js", packaged: false },
  { src: "lib/underscore-min.js", packaged: false },
  { src: "lib/bootstrap.min.js", packaged: false },
  { src: "lib/jquery.blockUI.js", packaged: false },
  { src: "lib/jquery-ui-1.10.1.custom.min.js", packaged: false }
).then(function() {
  steal.dev.log("Loading application files");
  steal("steal/less")
  .then("css/jashboard.less")
  .then("jashboard/modules.js")
  .then({ src: "test/funcunit/test_scenario_loader.js", ignore: true });
});


