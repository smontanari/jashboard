var jashboard = {
  functional_tests: []
};

steal("funcunit", "lib/underscore-min.js")
.then(
  "./funcunit_helper.js",
  "./features/feature_helper.js"
).then(
  "./features/ajax_loader_display.js",
  "./features/build_monitor_create.js",
  "./features/monitor_display.js",
  "./features/dashboard_create.js",
  "./features/tabs_display.js",
  "./features/no_tabs_display.js"
).then("./browser_close.js")
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
