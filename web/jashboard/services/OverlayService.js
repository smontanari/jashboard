(function(module) {
  jashboard = _.extend(module, {
    OverlayService: function() {
      var blockUISettings = {
        css: {
          padding: '15px', 
          backgroundColor:'#c2EBFF',
          border: '2px solid #000',
          'border-radius': '10px'
        },
        overlayCSS: {
          opacity: 0.5
        },
        fadeIn: 100,
        fadeOut: 200
      };

      this.show = function(selector) {
        blockUISettings.message = $(selector).html().trim();
        $.blockUI(blockUISettings);
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
