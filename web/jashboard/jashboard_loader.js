steal('jashboard/jashboard.js')
.then(function() {
  jashboard.resources = [
    'jashboardUtils',
    'routes'
  ];
  jashboard.packages = {
    services: [
      'ElementBinding',
      'AlertService',
      'OverlayService',
      'DialogService',
      'WidgetService',
      'HttpService',
      'TooltipService',
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
      "SwitchButton"
    ],
    directives: [
      'EventDirectiveDefinition',
      'DialogDirective', 
      'OverlayDirective',
      'AlertBoxDirective',
      'TooltipDirective',
      'TooltipTargetDirective',
      'DraggableDirective',
      'ResizableDirective',
      'MonitorDisplayDirective',
      'FormValidationDirective',
      'SlideShowDirective',
      'NotifyLastDirective',
      'SwitchButtonDirective'
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

  var loadPackage = function(packageName) {
    return function() {
      var files = _.map(jashboard.packages[packageName], function(file) {
        return "jashboard/" + packageName + "/" + file + ".js";
      });
      return steal.apply(null, files);
    };
  };
  var loadResources = function() {
    var files = _.map(jashboard.resources, function(file) {
      return "jashboard/" + file + ".js";
    });
    return steal.apply(null, files);
  }

  _.reduce(_.keys(jashboard.packages), function(loader, packageName) {
    return loader.then(loadPackage(packageName));
  }, steal())
  .then(loadResources)
  .then('jashboard/plugins.js');
});
