(function(module) {
  jashboard.widgets = _.extend(module, {
    Tooltip: function(targetSelector, contentSelector) {
      this.show = function() {
        $(targetSelector).tooltip({
          html: true,
          title: $(contentSelector).html(),
          container: "body"
        });
      };

      this.hide = function() {
        $(targetSelector).tooltip("destroy");
      };
    }
  });
}(jashboard.widgets || {}));
