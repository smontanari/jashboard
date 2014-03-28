define(['jashboard/jashboard-module', 'test/scenario_runner'], function(application, testRunner) {
  var misc = [
    'jashboardUtils',
    'routes'
  ];

  var packages = {
    services: [
      'ElementBinding',
      'AlertService',
      'OverlayService',
      'DialogService',
      'WidgetService',
      'HttpService',
      'PaginationService',
      'Repository',
      'IntersectionDetector',
      'MonitorPositioningStrategy',
      'MonitorLayoutManager',
      'PluginManager',
      'DashboardActionsHandler',
      'MenuActionsHandler'
    ],
    widgets: [
      "SwitchButton",
      "Tooltip",
    ],
    directives: [
      'DialogDirective', 
      'OverlayDirective',
      'AlertBoxDirective',
      'TooltipErrorDirective',
      'DraggableDirective',
      'ResizableDirective',
      'MonitorDisplayDirective',
      'FormValidationDirective',
      'SlideShowDirective',
      'NotifyLastDirective',
      'SwitchButtonDirective',
      'FocusDirective'
    ],
    model: [
      'Dashboard',
      'Monitor',
      'loadingStatus',
      'inputOptions'
    ],
    validation: [
      'FormValidator',
      'commonValidationRules',
      'ValidationRulesBuilder'
    ],
    controllers: [
      'scopeContextHelper',
      'MonitorFormHelper',
      'MainController',
      'DashboardFormValidationRules',
      'MonitorFormValidationRules',
      'DashboardFormController',
      'MonitorController',
      'MonitorFormController'
    ]
  };
  var root = 'jashboard/';

  var dependencies = [];
  _.each(misc, function(file) {
    dependencies.push(root + file);
  });

  _.each(_.keys(packages), function(packageName) {
    _.each(packages[packageName], function(file) {
      dependencies.push(root + packageName + "/" + file);
    });
  });

  return {
    run: function() {
      require([root + 'plugins.js'], function() {
        _.each(jashboard.plugins, function(pluginName) {
          dependencies.push(root + 'plugins/' + pluginName + '/' + pluginName + '_plugin.js');
        });
        require(dependencies, function() {
          if (_.isFunction(testRunner)) {
            testRunner(application.run);
          } else {
            application.run();
          }
        });
      });
    }
  };
});