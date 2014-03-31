define(['jashboard/plugins'], function() {
  return _.map(jashboard.plugins, function(pluginName) {
    return 'jashboard/plugins/' + pluginName + '/' + pluginName + '_plugin';
  });
});