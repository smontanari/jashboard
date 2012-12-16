jashboard.HttpService = function() {
  var ajaxRequest = function(url, configuration) {
    return jQuery.ajax(url, configuration);
  };

  this.getJSON = function(url, params) {
    return ajaxRequest(url, {
      type: 'GET',
      data: params,
      dataType: 'json'
    });
  };

  this.postJSON = function(url, obj) {
    var data = JSON.stringify(obj);
    return ajaxRequest(url, {
      type: 'POST',
      data: data,
      processData: false,
      contentType: "application/json",
      dataType: 'json'
    });
  };
};

jashboard.services.service('HttpService', [jashboard.HttpService]).run(function() {
  steal.dev.log("HttpService initialized");
});
