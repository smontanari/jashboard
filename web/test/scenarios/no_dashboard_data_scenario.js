define(['smocker'], function(smocker) {
  smocker.scenario('no_dashboard_data', function() {
    this.get('/ajax/dashboards').respondWith({
      content: []
    })
  });
});