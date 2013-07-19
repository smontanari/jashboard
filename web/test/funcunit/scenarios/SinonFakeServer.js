(function(testModule) {
  var _fakeServer;
  jashboard.test = _.extend(testModule, {
    SinonFakeServer: function() {
      var fakeServer = sinon.fakeServer.create();
      fakeServer.autoRespond = true;
      fakeServer.old_processRequest = fakeServer.processRequest;
      fakeServer.processRequest = function(request) {
        request.readyState = 4;
        this.old_processRequest(request);
      };

      var getResponseOptions = function(response, args) {
        var options = response;
        if (_.isFunction(response)) {
          options = response.apply(null, args);
        }
        return _.defaults(options, {
          returnCode: 200,
          contentType: "application/json",
          content: {}
        });
      };

      var executeResponse = function(returnCode, contentType, content) {
        this.respond(
          returnCode,
          { "Content-Type": contentType },
          JSON.stringify(content)
        );
      };

      this.fakeResponse = function(httpMethod, url, response) {
        fakeServer.respondWith(httpMethod, url, function() {
          var args = _.toArray(arguments);
          var xhr = args[0];
          var responseOptions = getResponseOptions(response, args);
          if (_.isNumber(responseOptions.delay)) {
            setTimeout(function() {
              executeResponse.apply(xhr, [responseOptions.returnCode, responseOptions.contentType, responseOptions.content]);
            }, (responseOptions.delay * 1000));
          } else {
            executeResponse.apply(xhr, [responseOptions.returnCode, responseOptions.contentType, responseOptions.content]);
          }
        });
      };
    },
    getFakeServer: function() {
      if (!_fakeServer) {
        _fakeServer = new jashboard.test.SinonFakeServer();
      }
      return _fakeServer;
    }
  });
}(jashboard.test || {}));
