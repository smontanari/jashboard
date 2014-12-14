define(['underscore'], function(_) {
  var misc = [
    'jashboardUtils',
    'routes'
  ];

  var packages = {
    model: [
      'Dashboard',
      'Monitor',
      'loadingStatus',
      'inputOptions'
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
    ],
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
      'DashboardActionsHandler',
      'MenuActionsHandler'
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
    validation: [
      'FormValidator',
      'commonValidationRules',
      'ValidationRulesBuilder'
    ],
    widgets: [
      "SwitchButton",
      "Tooltip",
    ],
  };
  var root = 'jashboard/';

  var modules = _.map(misc, function(file) {
    return root + file;
  });

  _.each(_.keys(packages), function(packageName) {
    _.each(packages[packageName], function(file) {
      modules.push(root + packageName + "/" + file);
    });
  });

  return modules;
});