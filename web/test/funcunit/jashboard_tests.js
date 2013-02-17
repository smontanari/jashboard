var jashboard = {
  functional_tests: []
};

steal(
  "funcunit", 
  "lib/underscore-min.js"
).then(function() {
  var allFeatures = [
    'tabs_display',
    'no_tabs_display',
    'monitor_display',
    'dashboard_create',
    'build_monitor_create',
    'ajax_loader_display',
    'monitor_positioning'
  ];

  var selectFeatures = function() {
    var regexp = /\?feature=(\w+)/
    var match = regexp.exec(window.location.search);
    if (match) {
      return [match[1]];
    }
    return allFeatures;
  };

  var featurePath = function(featureName) {
    return "./features/" + featureName + ".js";
  }

  steal(
    "./funcunit_helper.js",
    "./features/feature_helper.js"
  ).then(function() {
    steal.apply(window, _.map(selectFeatures(), featurePath));
  })
  .then("./browser_close.js")
  .then(function() {
    _.each(jashboard.functional_tests, function(test) {
      test();
    });
  });
});
