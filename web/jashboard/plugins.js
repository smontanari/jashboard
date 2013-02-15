(function() {
  var plugintTypes = [
    'build'
  ];
  
  steal("jashboard/plugins/TypeAdapter.js")
  .then(function() {
    _.each(plugintTypes, function(pluginType) {
      steal(
        "jashboard/plugins/" + pluginType + "/" + pluginType + "_plugins.js"
      );  
    });
  });
}());
