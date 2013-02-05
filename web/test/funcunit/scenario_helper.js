var scenarioHelper = {
  validateAjaxRequest: function(ajaxOptions, response, validator) {
    if (ajaxOptions.data !== null) {
      var requestData = JSON.parse(ajaxOptions.data);
      if (validator(JSON.parse(ajaxOptions.data))) {
        return response;
      }
    }
    throw("unexpected data in the POST request: " + ajaxOptions.data);
  }
};