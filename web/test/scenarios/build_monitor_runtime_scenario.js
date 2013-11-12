(function() {
  smocker.scenario('build_monitor_runtime', function() {
    this.get(/\/ajax\/monitor\/\w+\/runtime/).respondWith({
      content: {
        lastBuildTime: "2012-08-2012 14:32:23 +1000",
        duration: 752,
        success: true,
        status: 1
      }
    });
  });
})();
