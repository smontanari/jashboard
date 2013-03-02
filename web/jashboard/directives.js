(function() {
  var directives = [
    'Dialog', 
    'Overlay',
    'Tooltip',
    'Draggable',
    'Resizable'
  ];

  steal("jashboard/directives/EventDirectiveDefinition.js")
  .then(function() {
    _.each(directives, function(directiveName) {
      steal("jashboard/directives/" + directiveName + "Directive.js");  
    });
  });
}());
