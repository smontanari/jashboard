(function(module) {
  jashboard = _.extend(module, {
    WidgetService: function() {
      this.makeDraggable = function(selector, options) {
        var element = $(selector);
        var defaultOptions = {
          containment: "parent",
          scroll: true
        };

        element.draggable(_.extend(defaultOptions, options));
      };
      this.makeResizable = function(selector, options) {
        var element = $(selector);
        var defaultOptions = {
          containment: "parent",
          autoHide: true
        };

        element.resizable(_.extend(defaultOptions, options));
      };
      this.resetContainerHeight = function(selector) {
        var container = $(selector);
        var position = container.position();
        var height = container.height();
        var heightOffset = (container.outerHeight() - height)/2 + position.top;
        container.height(height - heightOffset);
      };
      this.setFocus = function(selector) {
        $(selector).focus();
      };
    }
  });
  jashboard.services.service('WidgetService', [jashboard.WidgetService])
  .run(['$log', function(log) {
    log.info("WidgetService initialized");
  }]);
}(jashboard || {}));
