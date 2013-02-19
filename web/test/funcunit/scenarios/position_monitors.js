$.fixture("GET /ajax/dashboards", "//test/funcunit/fixtures/monitors_in_position.json");
$.fixture("GET /ajax/monitor/monitor_1/runtime", "//test/funcunit/fixtures/monitor_1.json");
$.fixture("GET /ajax/monitor/monitor_3/runtime", "//test/funcunit/fixtures/monitor_3.json");

steal("test/funcunit/scenarios/update_monitor_position.js");
