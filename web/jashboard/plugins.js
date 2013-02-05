_.each(["build"], function(pluginType) {
  steal(
    "jashboard/plugins/" + pluginType + "/" + pluginType + "_plugins.js"
  );  
});
