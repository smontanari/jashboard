(function(module) {
  jashboard.plugin.build = _.extend(module, {
    go: {parseFormConfiguration: _.identity} 
  });
}(jashboard.plugin.build || {}));
