$.fixture("PUT /ajax/monitor/{id}/position", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var regexp = /\/ajax\/monitor\/(\w+)\/position/;
  var match = regexp.exec(ajaxOptions.url);
  if (match) {
    var position = JSON.parse(ajaxOptions.data);
    steal.dev.log("monitor[" + match[1] + "] moved to [top: " + position.top + ", left: " + position.left + "]");
    return [200, "success", null, {} ];    
  }
  return 400;
});  
