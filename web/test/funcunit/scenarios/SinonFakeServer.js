(function(testModule) {
  jashboard.test = _.extend(testModule, {
    SinonFakeServer: function() {
      var createResponseOptions = function(options) {
        return _.defaults(options, {
          returnCode: 200,
          contentType: "application/json",
          content: {},
          timeout: 0
        });
      };
      var fakeServer = sinon.fakeServer.create();
      fakeServer.autoRespond = true;
      fakeServer.old_processRequest = fakeServer.processRequest;
      fakeServer.processRequest = function(request) {
        request.readyState = 4;
        this.old_processRequest(request);
      };

      this.fakeResponse = function(httpMethod, url, response) {
        fakeServer.respondWith(httpMethod, url, function(xhr) {
          var responseOptions;
          if (_.isObject(response)) {
            responseOptions = createResponseOptions(response);
          }
          if (responseOptions.timeout > 0) {
            setTimeout(function() {
              xhr.respond(
                responseOptions.returnCode,
                { "Content-Type": responseOptions.contentType },
                JSON.stringify(responseOptions.content)
              );
            }, (responseOptions.timeout * 1000));
          }
        });
      };
    }
  });
}(jashboard.test || {}));
