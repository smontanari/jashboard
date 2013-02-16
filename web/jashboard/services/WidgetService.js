jashboard.WidgetService = function() {
  this.makeDraggable = function(draggableSelector, handleSelector) {
    var element = $(draggableSelector);
    element.draggable({ 
      containment: "parent",
      handle: handleSelector,
      scroll: true,
      stack: element
    });
  };
};

jashboard.services.service('WidgetService', [jashboard.WidgetService]).run(function() {
  steal.dev.log("WidgetService initialized");
});