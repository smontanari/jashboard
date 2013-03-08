(function() {
  var plugintTypes = [
    'ipsum',
    'build'
  ];
  
  steal("jashboard/plugins/TypeAdapter.js")
  .then(function() {
    _.each(plugintTypes, function(pluginType) {
      steal(
        "jashboard/plugins/" + pluginType + "/" + pluginType + "_plugin.js"
      );  
    });
  });
}());
