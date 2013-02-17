funcunitHelper.testFeature("Monitor positioning", "position_monitors", function() {
  test("should display monitors in their given position", function() {
    S("#monitor_1").position({top: 10, left: 60});
    S("#monitor_3").position({top: 200, left: 400});
  });

  test("should move monitors", function() {
    FuncUnit.wait(1000, function() {
      S("#monitor_1 .drag-handle").drag({
        to: "+0 +200",
        duration: 1000
      });
      S("#monitor_1").position({top: 210, left: 60});
    });

    FuncUnit.wait(1000, function() {
      S("#monitor_3 .drag-handle").drag({
        to: "-200 -200",
        duration: 1000
      });
      S("#monitor_3").position({top: 0, left: 200});
    });
  });
});
