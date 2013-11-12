(function() {
  smocker.scenario('monitor_layout', function() {
    this.get('/ajax/dashboards').redirectToFixture("test/scenarios/fixtures/fixture_1_dashboard.json");
    this.get('/ajax/monitor/monitor_1/runtime').redirectToFixture("test/scenarios/fixtures/fixture_build_monitor_1.json");
    this.get('/ajax/monitor/monitor_2/runtime').redirectToFixture("test/scenarios/fixtures/fixture_build_monitor_2.json");

    this.put('/ajax/monitor/monitor_1/position').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if (data.top === 210 && data.left === 60) {
        return {};
      }
      throw "unexpected data in the PUT request: " + requestData;
    });
    this.put('/ajax/monitor/monitor_1/size').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if (data.width === 295 && data.height === 340) {
        return {};
      }
      throw "unexpected data in the PUT request: " + requestData;
    });

    this.put('/ajax/monitor/monitor_2/position').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if (data.top === 0 && data.left === 200) {
        return {};
      }
      throw "unexpected data in the PUT request: " + requestData;
    });
    this.put('/ajax/monitor/monitor_2/size').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if (data.width === 270 && data.height === 350) {
        return {};
      }
      throw "unexpected data in the PUT request: " + requestData;
    });
  });
})();
