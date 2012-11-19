jashboard.MonitorFormController = function(scope, repository) {
  scope.saveMonitor = function() {
    repository.createMonitor(scope.monitorForm, function(monitor) {
      scope.$emit("NewMonitorEvent", monitor);
    });
    $(jashboard.constants.monitorFormSelector).modal('hide');
  };

  scope.$on("OpenMonitorDialog", function(event) {
    scope.monitorForm = {};
    $(jashboard.constants.monitorFormSelector).modal('show');
  });

  scope.displayMonitorOptions = function() {
    $("#buildMonitorInput").collapse("toggle");
  };

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


