(function(module) {
  jashboard = _.extend(module, {
    AlertService: function() {
      var _selector;
      var defaultOptions = {
        title: "Please confirm",
        confirmLabel: "Ok",
        cancelLabel: "Cancel",
        confirmAction: function() {}
      };
      this.bindTo = function(selector) {
        _selector = selector;
      };

      this.showAlert = function(options) {
        var elementScope = angular.element(_selector).scope();
        elementScope.alertOptions = _.defaults(options, defaultOptions);
        $(_selector).modal('show');
      };
    }
  });
  jashboard.services.service('AlertService', [jashboard.AlertService]).run(function() {
    steal.dev.log("AlertService initialized");
  });
}(jashboard || {}));
