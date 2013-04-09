var jashboard = {
  functional_tests: []
};

steal(
  "funcunit", 
  "lib/underscore-min.js"
).then(function() {
  var feature_sets = {
    dashboard_features: [
      'dashboard_create',
      'dashboard_edit',
      'dashboard_delete',
      'dashboard_validation',
      'dashboard_actions_errors'
    ],
    monitor_features: [
      'monitor_display',
      'monitor_create_validation',
      'monitor_positioning',
      'monitor_resizing',
      'monitor_runtime_refresh',
      'monitor_actions_errors',
      'monitor_delete',
      'monitor_edit'
    ],
    build_monitor_features: [
      'build_monitor_create'
    ]
  };
  
  var allFeatures = ['tabs_display', 'no_tabs_display', 'ajax_loader_display', 'data_loading_error'].concat(
    feature_sets.dashboard_features, feature_sets.monitor_features, feature_sets.build_monitor_features
  );

  var getUrlParameter = function(paramName) {
    var regexp = new RegExp("\\?" + paramName + "=(\\w+)");
    var match = regexp.exec(window.location.search);
    if (match) {
      return match[1];
    }
  };
  var selectFeatures = function() {
    var selectedFeature = getUrlParameter("feature");
    if (selectedFeature) return [selectedFeature];
    
    var selectedFeatureSet = getUrlParameter("suite");
    if (selectedFeatureSet) return feature_sets[selectedFeatureSet];

    return allFeatures;
  };

  var featurePath = function(featureName) {
    return "./features/" + featureName + ".js";
  }

  steal(
    "./features/support/page_helper.js",
    "./features/support/jashboard_feature_helper.js",
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
