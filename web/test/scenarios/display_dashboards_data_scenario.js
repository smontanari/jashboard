define(['smocker'], function(smocker) {
  smocker.scenario('display_dashboards_data', function() {
    this.get('/ajax/dashboards').redirectToFixture("test/scenarios/fixtures/fixture_dashboards.json");
    this.get('/ajax/monitor/monitor_1/runtime').redirectToFixture("test/scenarios/fixtures/fixture_build_monitor_1.json");
    this.get('/ajax/monitor/monitor_2/runtime').redirectToFixture("test/scenarios/fixtures/fixture_build_monitor_2.json");
    this.get('/ajax/monitor/monitor_3/runtime').redirectToFixture("test/scenarios/fixtures/fixture_ipsum_monitor.json");
    this.get('/ajax/monitor/monitor_4/runtime').redirectToFixture("test/scenarios/fixtures/fixture_vcs_monitor.json");
    this.get('/ajax/monitor/monitor_101/runtime').redirectToFixture("test/scenarios/fixtures/fixture_build_monitor_new.json");
    this.get('/ajax/monitor/monitor_102/runtime').redirectToFixture("test/scenarios/fixtures/fixture_vcs_monitor_new.json");
  });
});
