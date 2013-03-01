var featureHelper = (function(helper) {
  var waitAndDo = function(fn, wait) {
    if (wait) {
      FuncUnit.wait(wait, fn);
    } else {
      fn();
    }
  };

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
  
  helper.verifyElementPosition = function(selector, expectedPosition) {
    S(selector).visible(function() {
      var actualPosition = S(selector).position();
      equal(actualPosition.top, expectedPosition.top, "should have Y coordinate: " + expectedPosition.top);
      equal(actualPosition.left, expectedPosition.left, "should have X coordinate: " + expectedPosition.left);
    });
  };
  helper.verifyElementSize = function(selector, expectedSize) {
    S(selector).visible(function() {
      ok(expectedSize.width - 10 < S(selector).width() < expectedSize.width + 10);
      ok(expectedSize.height - 10 < S(selector).height() < expectedSize.height + 10);
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
