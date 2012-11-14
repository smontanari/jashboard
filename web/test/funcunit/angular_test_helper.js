jashboard.AngularTestHelper = {
  detectChange:  function(selector, handler) {
    steal.dev.log("Registering onchange listener with angular helper");
    $(selector).on('change', function(event) {
      steal.dev.log("Forcing propagation of change event on " + selector);
      handler($(event.target).val());
    });
  }
};
