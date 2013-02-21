(function(module) {
  jashboard = _.extend(module, {
    HttpService: function(logger) {
      var ajaxDefaults = {
        dataType: 'json'
      };
      var ajaxWriteDefaults = _.extend({
        processData: false,
        contentType: "application/json"
      }, ajaxDefaults);

      var ajaxRequest = function(url, settings) {
        return jQuery.ajax(url, settings).fail(function(xhr, status, error) {
          logger.error("Failed ajax request: " + status + " - " + error);
        });
      };

      this.getJSON = function(url, params) {
        return ajaxRequest(url, _.defaults({
          type: 'GET',
          data: params
        }, ajaxDefaults));
      };

      this.postJSON = function(url, obj) {
        return ajaxRequest(url, _.defaults({
          type: 'POST',
          data: JSON.stringify(obj),
        }, ajaxWriteDefaults));
      };

      this.putJSON = function(url, obj) {
        return ajaxRequest(url, _.defaults({
          type: 'PUT',
          data: JSON.stringify(obj),
        }, ajaxWriteDefaults));
      };
    }
  });
  jashboard.services.service('HttpService', ['$log', jashboard.HttpService]).run(function() {
    steal.dev.log("HttpService initialized");
  });
}(jashboard || {}));
