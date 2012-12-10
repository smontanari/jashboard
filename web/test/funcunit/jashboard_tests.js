var jashboard = {
  functional_tests: []
};

steal("funcunit", "lib/underscore-min.js")
.then("./funcunit_helper.js")
.then(
  "./features/monitor_create.js",
  "./features/monitor_display.js",
  "./features/dashboard_create.js",
  "./features/tabs_display.js"
)
.then("./browser_close.js")
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
