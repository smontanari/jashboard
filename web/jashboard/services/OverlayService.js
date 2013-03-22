(function(module) {
  jashboard = _.extend(module, {
    OverlayService: function() {
      var getSettings = function(selector, options) {
        var defaultSettings = {
          css: { backgroundColor:'transparent', border: '0px'},
          overlayCSS: { opacity: '0.5' },
          fadeIn: 100,
          fadeOut: 200
        };
        var settings = _.extend(defaultSettings, {
          message: $(selector),
          timeout: options.autoHideAfter
        });
        if (options.opacity) {
          settings.overlayCSS = {opacity: options.opacity};
        }
        return settings;
      };

      this.show = function(selector, options) {
        options = options || {};
        $.blockUI(getSettings(selector, options));
      };
      this.hide = function() {
        $.unblockUI();
      };
    }
  });
  jashboard.services.service('OverlayService', [jashboard.OverlayService]).run(function() {
    steal.dev.log("OverlayService initialized");
  });
}(jashboard || {}));
