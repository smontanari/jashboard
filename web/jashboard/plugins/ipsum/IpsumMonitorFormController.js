(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      var languages = ['english', 'french', 'latin'];
      scope.availableLanguages = languages;

      scope.$on("OpenMonitorDialog", function(event) {
        scope.monitorForm.configuration.ipsum = {
          language: languages[0]
        };
      });
    }
  });
  jashboard.application.controller("IpsumMonitorFormController", ['$scope', jashboard.plugin.ipsum.IpsumMonitorFormController])
    .run(function() {
      steal.dev.log("IpsumMonitorFormController initialized");
  });
}(jashboard.plugin.ipsum || {}));
