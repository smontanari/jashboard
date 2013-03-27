funcunitHelper.testFeature("Monitor positioning", "monitor_layout_scenario", function() {
  test("should layout monitors in the given position and be able to move them around", function() {
    pageHelper.verifyElementPosition("#monitor_1", {top: 10, left: 60});
    pageHelper.verifyElementPosition("#monitor_2", {top: 200, left: 400});

    pageHelper.mouseDrag({
      dragStartDelay: 500,
      handleSelector: "#monitor_1 .drag-handle",
      offset: "+0 +200"
    });
    pageHelper.verifyElementPosition("#monitor_1", {top: 210, left: 60});

    pageHelper.mouseDrag({
      dragStartDelay: 500,
      handleSelector: "#monitor_2 .drag-handle",
      offset: "-200 -200"
    });
    pageHelper.verifyElementPosition("#monitor_2", {top: 0, left: 200});
  });
});
