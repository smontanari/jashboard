jashboard.HttpService = function() {
  var ajaxDefaults = {
    dataType: 'json'
  };
  var ajaxWriteDefaults = _.extend({
    processData: false,
    contentType: "application/json"
  }, ajaxDefaults);

  var ajaxRequest = function(url, settings) {
    return jQuery.ajax(url, settings);
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
};

jashboard.services.service('HttpService', [jashboard.HttpService]).run(function() {
  steal.dev.log("HttpService initialized");
});
