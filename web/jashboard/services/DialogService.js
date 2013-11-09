(function(module) {
  jashboard = _.extend(module, {
    DialogService: function() {
      this.showModal = function(selector, callback) {
        $(selector).modal("show");
        if (_.isFunction(callback)) {
          $(selector).on("shown", callback);
        }
      };
      this.hideModal = function(selector) {
        $(selector).modal("hide");
      };
    }
  });
  jashboard.services.service('DialogService', [jashboard.DialogService])
  .run(['$log', function(log) {
    log.info("DialogService initialized");
  }]);
}(jashboard || {}));
