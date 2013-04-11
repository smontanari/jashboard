(function(jashboard) {
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
}(jashboard || {}));
