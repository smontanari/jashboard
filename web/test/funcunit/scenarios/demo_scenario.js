steal(
  "test/funcunit/scenarios/demo_dashboards_scenario.js",
  "test/funcunit/scenarios/demo_monitors_scenario.js"
).then(function() {
  smocker.groupScenarios('demo', ['demo_dashboards', 'demo_monitors']);
});