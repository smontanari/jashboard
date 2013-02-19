var scenarioHelper = {
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
  },
  SinonFakeServer: function() {
    var fakeServer = sinon.fakeServer.create();
    fakeServer.autoRespond = true;
    fakeServer.old_processRequest = fakeServer.processRequest;
    fakeServer.processRequest = function(request) {
      request.readyState = 4;
      this.old_processRequest(request);
    };

    this.fakeResponse = function(httpMethod, url, responseOptions) {
      var options = _.defaults(responseOptions, {
        returnCode: 200,
        contentType: "application/json",
        content: {},
        timeout: 0
      }); 

      fakeServer.respondWith(httpMethod, url, function(xhr) {
        if (options.timeout > 0) {
          setTimeout(function() {
            xhr.respond(
              options.returnCode,
              { "Content-Type": options.contentType },
              JSON.stringify(options.content)
            );
          }, (options.timeout * 1000));
        }
      });
    };
    return this;
  }
};