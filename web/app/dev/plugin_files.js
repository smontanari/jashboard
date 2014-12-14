define(['underscore', 'jashboard/plugins'], function(_) {
  return _.map(jashboard.plugins, function(pluginName) {
    return 'jashboard/plugins/' + pluginName + '/' + pluginName + '_plugin';
  });
});