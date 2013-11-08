(function() {
  smocker.scenario('monitor_layout_operations', function() {
    this.put(/\/ajax\/monitor\/(\w+)\/position/).respondWith(function(url, data, headers, monitor_id) {
      var position = JSON.parse(data);
      steal.dev.log("monitor[" + monitor_id + "] moved to [top: " + position.top + ", left: " + position.left + "]");
      return {status: 201};
    });

    this.put(/\/ajax\/monitor\/(\w+)\/size/).respondWith(function(url, data, headers, monitor_id) {
      var size = JSON.parse(data);
      steal.dev.log("monitor[" + monitor_id + "] resized to [width: " + size.width + ", height: " + size.height + "]");
      return {status: 201};
    });

    this.delete(/^\/ajax\/dashboard\/(\w+)\/monitor\/(\w+)$/).respondWith(function(url, data, headers, dashboard_id, monitor_id) {
      steal.dev.log("monitor[" + monitor_id + "] deleted");
      return {status: 204, delay: 1};
    });
  });
})();
