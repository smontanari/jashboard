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
      'Repository',
      'ModelMapper',
      'IntersectionDetector',
      'MonitorPositioningStrategy',
      'MonitorLayoutManager',
      'PluginManager',
      'DashboardActionsHandler',
      'MenuActionsHandler'
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
      'FormValidationDirective'
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

  steal(loadPackage("services"))
  .then(loadPackage("directives"))
  .then(loadPackage("model"))
  .then(loadPackage("validation"))
  .then(loadPackage("controllers"))
  .then(loadResources)
  .then('jashboard/plugins.js');
});
