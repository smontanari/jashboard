(function(testModule) {
  jashboard.test = _.extend(testModule, {
    monitorJsonResponseFixture: function(monitor_id, monitorParams) {
      return {json: {
          id: monitor_id,
          name: monitorParams.name,
          refreshInterval: monitorParams.refreshInterval,
          type: monitorParams.type,
          configuration: {
            type: monitorParams.configuration.type,
            hostname: monitorParams.configuration.hostname,
            port: monitorParams.configuration.port,
            buildId: monitorParams.configuration.buildId
          }
        }
      };
    }
  });
}(jashboard.test || {}));
