(function() {
  var directives = [
    'Dialog', 
    'Overlay'
  ];

  steal("jashboard/directives/EventDirectiveDefinition.js")
  .then(function() {
    _.each(directives, function(directiveName) {
      steal("jashboard/directives/" + directiveName + "Directive.js");  
    });
  });
}());
