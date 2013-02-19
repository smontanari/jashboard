$.fixture("PUT /ajax/monitor/{id}/position", function(ajaxOriginalOptions, ajaxOptions, headers) {
  // var position = JSON.parse(ajaxOptions.data);
  steal.dev.log("monitor[" + ajaxOriginalOptions.data.id + "] moved to [top: " + ajaxOptions.data.top + ", left: " + ajaxOptions.data.left + "]");
  return [200, "success", null, {} ];
});  
