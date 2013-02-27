(function(module) {
  jashboard = _.extend(module, {
    TooltipService: function() {
      this.add = function(targetSelector, contentSelector) {
        $(targetSelector).tooltip({
          html: true,
          title: $(contentSelector).html(),
          container: "body"
        });
      };
    }
  });
  jashboard.services.service('TooltipService', [jashboard.TooltipService]).run(function() {
    steal.dev.log("TooltipService initialized");
  });
}(jashboard || {}));
