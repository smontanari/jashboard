steal.dev.log("Loading jashboard modules");
steal('jashboard/jashboard.js')
.then('jashboard/jashboardUtils.js')
.then(
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  'jashboard/model/LoadingStatus.js',
  'jashboard/services/ElementBinding.js',
  'jashboard/services/AlertService.js',
  'jashboard/services/OverlayService.js',
  'jashboard/services/DialogService.js',
  'jashboard/services/WidgetService.js',
  'jashboard/services/HttpService.js',
  'jashboard/services/TooltipService.js',
  'jashboard/services/Repository.js',
  'jashboard/services/ModelMapper.js',
  'jashboard/services/IntersectionDetector.js',
  'jashboard/services/MonitorPositioning.js',
  'jashboard/services/MonitorLayoutManager.js',
  'jashboard/services/PluginManager.js',
  'jashboard/services/DashboardActionsHandler.js',
  'jashboard/services/MenuActionsHandler.js'
)
.then(
  'jashboard/controllers/scopeContextHelper.js',
  'jashboard/controllers/CreateMonitorWorkflow.js',
  'jashboard/controllers/MainController.js',
  'jashboard/controllers/DashboardFormController.js',
  'jashboard/controllers/MonitorController.js',
  'jashboard/controllers/MonitorFormController.js'
)
.then(
  'jashboard/directives.js',
  'jashboard/plugins.js'
).then(
  'jashboard/routes.js'
);
