funcunitHelper.testFeature("Monitor resizing", "monitor_layout_scenario", function() {
  test("should display monitors with the given size and be able to resize them", function() {
    featureHelper.verifyElementSize("#monitor_1", {width: 240, height: 140});
    featureHelper.verifyElementSize("#monitor_2", {width: 270, height: 150});

    featureHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_1",
      handleSelector: "#monitor_1 .ui-resizable-se",
      offset: "+50 +200"
    });
    featureHelper.verifyElementSize("#monitor_1", {width: 290, height: 340});

    featureHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_2",
      handleSelector: "#monitor_2 .ui-resizable-se",
      offset: "+0 +200"
    });
    featureHelper.verifyElementSize("#monitor_2", {width: 270, height: 350});
  });
});
