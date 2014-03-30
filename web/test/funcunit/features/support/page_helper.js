var pageHelper = (function(helper) {
  helper.inputText = function(inputName, text) {
    var selector = "input[name='" + inputName + "']";
    F(selector).visible().focus().type("");
    F(selector).visible().focus().type(text, function() {
      F(selector).trigger('input');
    });
  };

  helper.toggleInput = function(inputName, value) {
    var isChecked = F("input[name='" + inputName + "']").attr("checked") === "checked";
    if (value !== isChecked) {
      F("input[name='" + inputName + "']").click();
    }
  };

  helper.mouseDrag = function(options) {
    defaults = {
      dragStartDelay: 100,
      duration: 1000
    };
    options = _.defaults(options, defaults);
    if (options.elementSelector) {
      F(options.elementSelector).visible().mouseover();
    }
    FuncUnit.wait(options.dragStartDelay, function() {
      F(options.handleSelector).mouseover();
      F(options.handleSelector).drag({to: options.offset, duration: options.duration});
    });
  };

  helper.verifyInputValue = function(inputName, value, errorMessage) {
    F("input[name='" + inputName + "']").visible().val(value, errorMessage);
  };

  helper.verifyElementEnabled = function(selector, message) {
    F(selector).visible(function() {
      var disabled = F(selector).attr("disabled");
      ok(_.isEmpty(disabled), message);
    });
  };

  helper.verifyElementDisabled = function(selector, message) {
    F(selector).visible(function() {
      var disabled = F(selector).attr("disabled");
      ok(!_.isEmpty(disabled), message);
    });
  };

  helper.verifyElementPosition = function(selector, expectedPosition) {
    F(selector).visible(function() {
      var actualPosition = F(selector).position();
      equal(actualPosition.top, expectedPosition.top, "should have Y coordinate: " + expectedPosition.top);
      equal(actualPosition.left, expectedPosition.left, "should have X coordinate: " + expectedPosition.left);
    });
  };
  helper.verifyElementSize = function(selector, expectedSize) {
    F(selector).visible(function() {
      var actualWidth = F(selector).width();
      var actualHeight = F(selector).height();
      ok((expectedSize.width - 10) < actualWidth && actualWidth < (expectedSize.width + 10), 
        "Element width should be == " + expectedSize.width);
      ok((expectedSize.height - 10) < actualHeight && actualHeight < (expectedSize.height + 10),
        "Element height should be == " + expectedSize.height);
    });
  };
  helper.verifyElementContent = function(selector, expectedData) {
    F(selector).visible(function() {
      _.each(_.keys(expectedData), function(propertySelector) {
        equal(F(selector + " " + propertySelector).text().trim(), expectedData[propertySelector], "should have content: " + expectedData[propertySelector]);
      });
    });
  };
  helper.verifyInputError = function(input, expectedError, callback) {
    FuncUnit.wait(300, function() {
      pageHelper.inputText(input.inputName, input.inputValue);
      F(expectedError.errorSelector).visible(function() {
        equal(F(expectedError.errorSelector).text().trim(), expectedError.errorMessage, "The error message is equal to " + expectedError.message);
      }, "should display error");
      if (_.isFunction(callback)) {
        callback();
      }
    });
  };

  return helper;
}(pageHelper || {}));
