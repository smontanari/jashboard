steal(
  "test/scenarios/demo_dashboards_scenario.js",
  "test/scenarios/demo_monitors_scenario.js",
  "test/scenarios/monitor_layout_operations_scenario.js"
).then(function() {
  smocker.groupScenarios('demo', ['demo_dashboards', 'demo_monitors', 'monitor_layout_operations']);
});