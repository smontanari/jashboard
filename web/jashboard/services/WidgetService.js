(function(module) {
  jashboard = _.extend(module, {
    WidgetService: function() {
      this.makeDraggable = function(selector, options) {
        var element = $(selector);
        var defaultOptions = {
          containment: "parent",
          scroll: true,
          stack: element
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

      this.resizeFromParent = function(childrenSelector, parentSelector) {
        var parentElement = $(parentSelector);
        $(childrenSelector, parentElement).each(function(index, element) {
          var position = $(element).position();
          var calculatedHeight = $(parentElement).height() - position.top;
          $(element).height(calculatedHeight);
        });
      };
    }
  });
  jashboard.services.service('WidgetService', [jashboard.WidgetService]).run(function() {
    steal.dev.log("WidgetService initialized");
  });
}(jashboard || {}));
