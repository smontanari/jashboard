funcunitHelper.testFeature("Monitor resizing", "resize_monitors", function() {
  test("should display monitors with the given size", function() {
    featureHelper.verifyElementSize("#monitor_1", {width: 240, height: 140});
    featureHelper.verifyElementSize("#monitor_3", {width: 270, height: 150});
  });

  test("should resize monitors", function() {
    featureHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_1",
      handleSelector: "#monitor_1 .ui-resizable-se",
      offset: "+50 +200"
    });
    featureHelper.verifyElementSize("#monitor_1", {width: 290, height: 340});

    featureHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_3",
      handleSelector: "#monitor_3 .ui-resizable-se",
      offset: "+0 +200"
    });
    featureHelper.verifyElementSize("#monitor_3", {width: 270, height: 350});
  });
});
