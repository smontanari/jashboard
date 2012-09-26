jashboard.services.value('httpService', {
  getJSON: function(url, params) {
    var settings = {
      type: 'GET',
      data: params,
      dataType: 'json'
    };
    return jQuery.ajax(url, settings);
  }
}).run(function() {
  steal.dev.log("HttpService initialized");
});
