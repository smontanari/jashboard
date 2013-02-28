funcunitHelper.testFeature("Monitor resizing", "resize_monitors", function() {
  var verifySize = function(selector, expectedSize) {
    S(selector).visible(function() {
      var actualWidth = S(selector).width();
      var actualHeight = S(selector).height();
      ok(expectedSize.width - 10 < actualWidth < expectedSize.width + 10);
      ok(expectedSize.height - 10 < actualHeight < expectedSize.height + 10);
    });
  };
  
  test("should display monitors with the given size", function() {
    verifySize("#monitor_1", {width: 240, height: 140});
    verifySize("#monitor_3", {width: 270, height: 150});
  });

  test("should resize monitors", function() {
    FuncUnit.wait(500, function() {
      S("#monitor_1").visible().mouseover();
      FuncUnit.wait(1000, function() {
        S("#monitor_1 .ui-resizable-se").mouseover();
        S("#monitor_1 .ui-resizable-se").drag({to: "+50 +100", duration: 1000});
      });
    });
    FuncUnit.wait(500, function() {
      verifySize("#monitor_1", {width: 290, height: 240});
    });
    FuncUnit.wait(500, function() {
      S("#monitor_3").visible().mouseover();
      FuncUnit.wait(1000, function() {
        S("#monitor_3 .ui-resizable-se").mouseover();
        S("#monitor_3 .ui-resizable-se").drag({to: "+0 +200", duration: 1000});
      });
    });
    FuncUnit.wait(500, function() {
      verifySize("#monitor_3", {width: 270, height: 350});
    });
  });
});
