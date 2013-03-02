funcunitHelper.testFeature("Monitor positioning", "position_monitors", function() {
  test("should display monitors in their given position", function() {
    featureHelper.verifyElementPosition("#monitor_1", {top: 10, left: 60});
    featureHelper.verifyElementPosition("#monitor_3", {top: 200, left: 400});
  });

  test("should move monitors", function() {
    featureHelper.mouseDrag({
      dragStartDelay: 500,
      handleSelector: "#monitor_1 .drag-handle",
      offset: "+0 +200"
    });
    featureHelper.verifyElementPosition("#monitor_1", {top: 210, left: 60});

    featureHelper.mouseDrag({
      dragStartDelay: 500,
      handleSelector: "#monitor_3 .drag-handle",
      offset: "-200 -200"
    });
    featureHelper.verifyElementPosition("#monitor_3", {top: 0, left: 200}, 500);
  });
});
