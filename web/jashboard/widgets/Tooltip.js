(function(module) {
  jashboard.widgets = _.extend(module, {
    Tooltip: function(targetSelector, contentSelector, tooltipClass) {
      this.show = function() {
        $(targetSelector).tooltip({
          content: $(contentSelector).html().trim(),
          tooltipClass: tooltipClass
        });
      };

      this.hide = function() {
        $(targetSelector).tooltip("destroy");
      };
    }
  });
}(jashboard.widgets || {}));
