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
    'ajax_loader_display',
    'data_loading_error',
    'dashboard_create',
    'dashboard_delete',
    'dashboard_actions_errors',
    'monitor_display',
    'monitor_create_validation',
    'build_monitor_create',
    'monitor_positioning',
    'monitor_resizing',
    'monitor_runtime_refresh',
    'monitor_actions_errors',
    'monitor_delete'
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
    "./features/page_helper.js",
    "./features/jashboard_feature_helper.js",
    "./funcunit_helper.js"
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
