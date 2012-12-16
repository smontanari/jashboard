jashboard.MonitorFormController = function(scope, repository) {
  var monitorFormSelector = "#new-monitor-form";

  scope.saveMonitor = function() {
    repository.createMonitor(scope.monitorForm, function(monitor) {
      scope.$emit("NewMonitorEvent", monitor);
    });
    $(monitorFormSelector).modal('hide');
  };

  scope.$on("OpenMonitorDialog", function(event) {
    scope.monitorForm = {configuration: {}};
    $(monitorFormSelector).modal('show');
  });

  scope.displayMonitorOptions = function() {
    $("#" + this.monitorForm.type + "MonitorInput").collapse("toggle");
  };

  scope.monitorConfigurationFormView = function(type) {
    return "html/plugins/" + type + "/monitor_configuration_form_view.html";
  };

  // $('#buildMonitorInput a[data-toggle="tab"]').on('shown', function (e) {
  //   $(e.target).attr('href');
  // });

  // crap... angular does not detect some of the ui changes triggered by funcunit, so we have to force the scope change
  // this code is supposed to execute only during functional testing
  if (_.isObject(jashboard.AngularTestHelper)) {
    //jashboard.AngularTestHelper.detectChange("input[name='monitorName']", function(value) {
       //scope.monitorForm.name = value;
    //});
  }
};

jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', jashboard.MonitorFormController]).run(function() {
  steal.dev.log("MonitorFormController initialized");
});


