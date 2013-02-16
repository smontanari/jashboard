jashboard.WidgetService = function() {
  this.makeDraggable = function(selector) {
    var element = $(selector);
    element.draggable({ 
      containment: "parent",
      handle: ".drag-handle",
      scroll: true,
      stack: element
    });
  };
};

jashboard.services.service('WidgetService', [jashboard.WidgetService]).run(function() {
  steal.dev.log("WidgetService initialized");
});