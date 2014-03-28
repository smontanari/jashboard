define([
  "test/scenarios/demo_dashboards_scenario",
  "test/scenarios/demo_monitors_scenario",
  "test/scenarios/monitor_layout_operations_scenario"
], function() {
  smocker.groupScenarios('demo', ['demo_dashboards', 'demo_monitors', 'monitor_layout_operations']);
});