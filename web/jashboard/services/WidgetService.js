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

      this.resetContainerHeight = function(element) {
        var container = $(element);
        var position = container.position();
        var height = container.height();
        var heightOffset = (container.outerHeight() - height)/2 + position.top;
        container.height(height - heightOffset);
      };

      this.makeSwitchButton = function(selector, initialValue, onChangeFn) {
        var element = $(selector);
        element.bootstrapSwitch();
        element.bootstrapSwitch('setState', initialValue);
        element.on('change', onChangeFn);
      };
    }
  });
  jashboard.services.service('WidgetService', [jashboard.WidgetService]).run(function() {
    steal.dev.log("WidgetService initialized");
  });
}(jashboard || {}));
