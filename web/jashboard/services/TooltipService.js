(function(module) {
  jashboard = _.extend(module, {
    TooltipService: function() {
      this.attachTextTooltip = function(targetSelector, text) {
        $(targetSelector).tooltip({
          title: text,
          container: "body"
        });
      };
      // this.attachContentTooltip = function(targetSelector, contentSelector) {
      //   $(targetSelector).tooltip({
      //     html: true,
      //     title: $(contentSelector).html(),
      //     container: "body"
      //   });
      // };
      this.removeTooltip = function(targetSelector) {
        $(targetSelector).tooltip('destroy');
      }
    }
  });
  jashboard.services.service('TooltipService', [jashboard.TooltipService]).run(function() {
    steal.dev.log("TooltipService initialized");
  });
}(jashboard || {}));
