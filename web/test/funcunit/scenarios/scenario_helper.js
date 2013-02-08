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
  fixtureBuildMonitorJsonResponse: function(monitor_id, monitorParams) {
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
  },
  SinonFakeServer: function() {
    var fakeServer = sinon.fakeServer.create();
    fakeServer.autoRespond = true;
    fakeServer.old_processRequest = fakeServer.processRequest;
    fakeServer.processRequest = function(request) {
      request.readyState = 4;
      this.old_processRequest(request);
    };
    // return fakeServer;
    this.fakeResponse = function(method, url, responseOptions) {
      responseOptions = responseOptions || {};
      var options = _.defaults(responseOptions, {
        returnCode: 200,
        contentType: "application/json",
        content: {},
        timeout: 0
      }); 

      fakeServer.respondWith(method, url, function(xhr) {
        if (options.timeout > 0) {
          setTimeout(function() {
            xhr.respond(options.returnCode, { "Content-Type": options.contentType }, JSON.stringify(options.content));
          }, options.timeout);
        }
      });
    };
    return this;
  }
};