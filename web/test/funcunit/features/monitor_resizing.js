funcunitHelper.testFeature("Monitor resizing", "monitor_layout", function() {
  this.createTest("it displays monitors with the given size and resizes them", function() {
    pageHelper.verifyElementSize("#monitor_1", {width: 240, height: 140});
    pageHelper.verifyElementSize("#monitor_2", {width: 270, height: 150});

    pageHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_1",
      handleSelector: "#monitor_1 .ui-resizable-se",
      offset: "+50 +200"
    });
    pageHelper.verifyElementSize("#monitor_1", {width: 290, height: 340});

    pageHelper.mouseDrag({
      dragStartDelay: 500,
      elementSelector: "#monitor_2",
      handleSelector: "#monitor_2 .ui-resizable-se",
      offset: "+0 +200"
    });
    pageHelper.verifyElementSize("#monitor_2", {width: 270, height: 350});
  });
});
