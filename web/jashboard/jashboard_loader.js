(function() {
  var jashboardResources = [
    'jashboardUtils',
    'routes'
  ];

  var jashboardPackages = {
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

  var resources = _.map(jashboardResources, function(file) {
    return "jashboard/" + file + ".js";
  });
  var packages = _.reduce(_.keys(jashboardPackages), function(modules, packageName) {
    return modules.concat(_.map(jashboardPackages[packageName], function(file) {
      return "jashboard/" + packageName + "/" + file + ".js";
    }));
  }, []);
  
  steal('jashboard/modules.js', function() {
    steal.apply(null, resources);
    steal.apply(null, packages);
    steal('jashboard/plugins.js', function() {
      _.each(jashboard.plugins, function(pluginName) {
        steal("jashboard/plugins/" + pluginName + "/" + pluginName + "_plugin.js");
      });
    });
  });
})();