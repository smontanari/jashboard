(function(module) {
  jashboard = _.extend(module, {
    AlertService: function() {
      var elementBinding = new jashboard.ElementBinding();
      var defaultOptions = {
        title: "Please confirm",
        confirmLabel: "Ok",
        cancelLabel: "Cancel",
        confirmAction: function() {}
      };

      this.bindTo = function(selector) {
        elementBinding.bindDefaultElement(selector);
      };

      this.showAlert = function(options) {
        elementBinding.applyToElement(function(element, scope) {
          scope.alertOptions = _.defaults(options, defaultOptions);
          $(element).modal('show');
          $(".modal-backdrop").css("opacity", "0.2");
        });
      };
    }
  });
  jashboard.services.service('AlertService', [jashboard.AlertService])
  .run(['$log', function(log) {
    log.info("AlertService initialized");
  }]);
}(jashboard || {}));
