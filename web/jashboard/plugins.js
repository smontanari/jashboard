(function() {
  var plugins = [
    'ipsum',
    'build'
  ];
  
  steal("jashboard/plugins/TypeAdapter.js")
  .then(function() {
    _.each(plugins, function(plugin) {
      steal(
        "jashboard/plugins/" + plugin + "/" + plugin + "_plugin.js"
      );  
    });
  });
}());
