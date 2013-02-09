jashboard.DialogService = function() {
  this.showModal = function(selector) {
    $(selector).modal("show");
  };
  this.hideModal = function(selector) {
    $(selector).modal("hide");
  };
};

jashboard.services.service('DialogService', [jashboard.DialogService]).run(function() {
  steal.dev.log("DialogService initialized");
});