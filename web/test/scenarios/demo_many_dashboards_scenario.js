define(['smocker'], function(smocker) {
  var dashboards = [];
  _.times(5, function(i) {
    dashboards.push({id: "test_" + (i+1), name: "dashboard_" + (i+1), monitors: []});
  });

  smocker.scenario('demo_many_dashboards', function() {
    this.get("/ajax/dashboards").respondWith({
      content: dashboards,
      delay: 1
    });
  });
});