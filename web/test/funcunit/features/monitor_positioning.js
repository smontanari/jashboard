funcunitHelper.testFeature("Monitor positioning", "monitor_position", function() {
  test("should display monitors in their given position", function() {
    S("#monitor_1").position({top: 10, left: 60}, "should be in expected position");
    S("#monitor_3").position({top: 200, left: 400}, "should be in expected position");
  });
});
