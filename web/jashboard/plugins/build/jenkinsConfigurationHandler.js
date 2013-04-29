(function(module) {
  jashboard.plugin.build = _.extend(module, {
    jenkins: {parseFormConfiguration: _.identity}
  });
}(jashboard.plugin.build || {}));
