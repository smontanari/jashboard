var featureHelper = (function(helper) {
  helper.inputText = function(selector, text) {
    S(selector).visible().focus().type(text, function() {
      S(selector).trigger('input');
    });
  };

  helper.mouseDrag = function(options) {
    defaults = {
      dragStartDelay: 100,
      duration: 1000
    };
    options = _.defaults(options, defaults);
    if (options.elementSelector) {
      S(options.elementSelector).visible().mouseover();
    }
    FuncUnit.wait(options.dragStartDelay, function() {
      S(options.handleSelector).mouseover();
      S(options.handleSelector).drag({to: options.offset, duration: options.duration});
    });
  };

  helper.verifyElementDisabled = function(selector) {
    S(selector).visible(function() {
      var disabled = S(selector).attr("disabled");
      ok(!_.isEmpty(disabled));
    });
  };

  helper.verifyElementPosition = function(selector, expectedPosition) {
    S(selector).visible(function() {
      var actualPosition = S(selector).position();
      equal(actualPosition.top, expectedPosition.top, "should have Y coordinate: " + expectedPosition.top);
      equal(actualPosition.left, expectedPosition.left, "should have X coordinate: " + expectedPosition.left);
    });
  };
  helper.verifyElementSize = function(selector, expectedSize) {
    S(selector).visible(function() {
      var actualWidth = S(selector).width();
      var actualHeight = S(selector).height();
      ok((expectedSize.width - 10) < actualWidth && actualWidth < (expectedSize.width + 10), 
        "Element width should be == " + expectedSize.width);
      ok((expectedSize.height - 10) < actualHeight && actualHeight < (expectedSize.height + 10),
        "Element height should be == " + expectedSize.height);
    });
  };
  helper.verifyElementContent = function(selector, expectedData) {
    S(selector).visible(function() {
      _.each(_.keys(expectedData), function(propertySelector) {
        equal(S(selector + " " + propertySelector).text().trim(), expectedData[propertySelector], "should have content: " + expectedData[propertySelector]);
      });
    });
  };
  return helper;
}(featureHelper || {}));
