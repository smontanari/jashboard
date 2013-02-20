(function(module) {
  jashboard = _.extend(module, {
    WidgetService: function() {
      this.makeDraggable = function(draggableSelector, options) {
        var element = $(draggableSelector);
        var defaultOptions = { 
          containment: "parent",
          scroll: true,
          stack: element
        };

        element.draggable(_.extend(defaultOptions, options));
      };
    }
  });
  jashboard.services.service('WidgetService', [jashboard.WidgetService]).run(function() {
    steal.dev.log("WidgetService initialized");
  });
}(jashboard || {}));
