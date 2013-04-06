(function() {
  var directives = [
    'Dialog', 
    'Overlay',
    'AlertBox',
    'Tooltip',
    'TooltipTarget',
    'Draggable',
    'Resizable',
    'MonitorDisplay',
    'FormValidation'
  ];

  steal("jashboard/directives/EventDirectiveDefinition.js")
  .then(function() {
    _.each(directives, function(directiveName) {
      steal("jashboard/directives/" + directiveName + "Directive.js");  
    });
  });
}());
