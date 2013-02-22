steal.dev.log("loading jashboard modules");
steal('jashboard/jashboard.js')
.then('jashboard/jashboardUtils.js')
.then(
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  'jashboard/model/LoadingStatus.js',
  'jashboard/services/OverlayService.js',
  'jashboard/services/DialogService.js',
  'jashboard/services/WidgetService.js',
  'jashboard/services/HttpService.js',
  'jashboard/services/Repository.js',
  'jashboard/services/ModelMapper.js',
  'jashboard/services/PluginManager.js',
  'jashboard/services/DashboardControllerDelegate.js',
  'jashboard/services/MonitorControllerDelegate.js'
)
.then(
  'jashboard/controllers/MainController.js',
  // 'jashboard/controllers/DashboardActionsController.js',
  'jashboard/controllers/DashboardFormController.js',
  'jashboard/controllers/CreateMonitorWorkflow.js',
  'jashboard/controllers/MonitorFormController.js'
)
.then(
  'jashboard/directives.js',
  'jashboard/plugins.js'
);
