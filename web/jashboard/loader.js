(function() {
  var JASHBOARD_ENVIRONMENT = "development";
  steal("jashboard/environment.js", function() {
    var loaderFn = steal;
    jashboard.environments[JASHBOARD_ENVIRONMENT].forEach(function(resource) {
      loaderFn = loaderFn.apply(null, resource.resourceSet).then;
    });
  });
}());
