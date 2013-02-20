(function(testModule) {
  jashboard.test = _.extend(testModule, {
    monitorJsonResponseFixture: function(monitor_id, monitorParams) {
      return {json: {
          "id": monitor_id,
          "name": monitorParams.name,
          "refresh_interval": monitorParams.refreshInterval,
          "type": monitorParams.type,
          "configuration": {
            "type": monitorParams.configuration.type,
            "hostname": monitorParams.configuration.hostname,
            "port": monitorParams.configuration.port,
            "build_id": monitorParams.configuration.build_id
          }
        }
      };
    }
  });
}(jashboard.test || {}));
