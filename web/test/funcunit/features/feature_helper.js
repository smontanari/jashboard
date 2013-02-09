var featureHelper = {
  verifyMonitorData: function(monitor_id, expectedData) {
    S(monitor_id).visible(function() {
      _.each(_.keys(expectedData), function(propertySelector) {
        equal(S(monitor_id + " " + propertySelector).text().trim(), expectedData[propertySelector], "verifying content of " + propertySelector);
      });
    });
  }
};