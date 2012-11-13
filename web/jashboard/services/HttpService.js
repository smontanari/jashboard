jashboard.HttpService = function() {
  var ajaxRequest = function(url, type, data, dataType) {
    var settings = {
      type: type,
      data: data,
      dataType: dataType
    };
    return jQuery.ajax(url, settings);
  };

  this.getJSON = function(url, params) {
    return ajaxRequest(url, "GET", params, 'json');
  };

  this.postJSON = function(url, data) {
    return ajaxRequest(url, "POST", data, 'json');
  };
};

jashboard.services.service('HttpService', [jashboard.HttpService]).run(function() {
  steal.dev.log("HttpService initialized");
});
