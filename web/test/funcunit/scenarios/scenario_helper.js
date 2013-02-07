var scenarioHelper = {
  validateAjaxRequest: function(ajaxOptions, response, validator) {
    if (ajaxOptions.data !== null) {
      var requestData = JSON.parse(ajaxOptions.data);
      if (validator(JSON.parse(ajaxOptions.data))) {
        return response;
      }
    }
    throw("unexpected data in the POST request: " + ajaxOptions.data);
  },
  buildMonitorJsonResponse: function(monitor_id, monitorParams) {
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
};