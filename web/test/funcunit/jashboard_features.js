var jashboard = {
  functional_tests: []
};

steal(
  "bower_components/underscore/underscore-min.js",
  "funcunit/funcunit.js"
).then(function() {
  var feature_sets = {
    misc_features: [
      'tabs_display',
      'no_tabs_display',
      'ajax_loader_display',
      'data_loading_error'
    ],
    dashboard_features: [
      'dashboard_create',
      'dashboard_edit',
      'dashboard_delete',
      'dashboard_validation',
      'dashboard_actions_errors'
    ],
    monitor_features: [
      'monitor_edit',
      'monitor_validation',
      'monitor_delete',
      'monitor_runtime_refresh',
      'monitor_actions_errors',
      'monitor_positioning',
      'monitor_resizing'
    ],
    build_monitor_features: [
      'build_monitor_display',
      'build_monitor_create',
      'build_monitor_edit',
      'build_monitor_validation'
    ],
    vcs_monitor_features: [
      // 'vcs_monitor_display',
      'vcs_monitor_create'
      // 'vcs_monitor_edit',
      // 'vcs_monitor_validation'
    ]
  };
  
  var allFeatures = [].concat(
    feature_sets.misc_features,
    feature_sets.dashboard_features,
    feature_sets.monitor_features,
    feature_sets.build_monitor_features,
    feature_sets.vcs_monitor_features
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
    return "test/funcunit/features/" + featureName + ".js";
  }

  steal(
    "test/funcunit/features/support/page_helper.js",
    "test/funcunit/features/support/jashboard_feature_helper.js",
    "test/funcunit/features/support/build_monitor_feature_helper.js",
    "test/funcunit/features/support/vcs_monitor_feature_helper.js",
    "test/funcunit/funcunit_helper.js"
  ).then(function() {
    steal.apply(window, _.map(selectFeatures(), featurePath));
  })
  .then("test/funcunit/browser_close.js")
  .then(function() {
    _.each(jashboard.functional_tests, function(test) {
      test();
    });
  });
});
