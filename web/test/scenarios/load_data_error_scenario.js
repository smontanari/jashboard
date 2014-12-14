define(['smocker'], function(smocker) {
  smocker.scenario('load_data_error', function() {
    this.get('/ajax/dashboards').respondWith({
      status: 500
    });
  });
});