funcunitHelper.testFeature("Monitor positioning", "position_monitors", function() {
  var verifyPosition = function(expectedPosition, actualPosition) {
    equal(actualPosition.top, expectedPosition.top, "should have same X coordinate");
    equal(actualPosition.left, expectedPosition.left, "should have same X coordinate");
  };
  
  test("should display monitors in their given position", function() {
    verifyPosition({top: 10, left: 60}, S("#monitor_1").position());
    verifyPosition({top: 200, left: 400}, S("#monitor_3").position());
  });

  test("should move monitors", function() {
    FuncUnit.wait(500, function() {
      S("#monitor_1 .drag-handle").drag({
        to: "+0 +200",
        duration: 1000
      });
    });
    FuncUnit.wait(500, function() {
      verifyPosition({top: 210, left: 60}, S("#monitor_1").position());
    });

    FuncUnit.wait(500, function() {
      S("#monitor_3 .drag-handle").drag({
        to: "-200 -200",
        duration: 1000
      });
    });
    FuncUnit.wait(500, function() {
      verifyPosition({top: 0, left: 200}, S("#monitor_3").position());
    });
  });
});
