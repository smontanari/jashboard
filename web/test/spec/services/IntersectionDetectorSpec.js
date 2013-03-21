describe("IntersectionDetector", function() {
  it("should not detect intersection when there is no overlap", function() {
    var rectangle1 = {
      position: { top: 0, left: 0 },
      size: { width: 100, height: 150 }
    };
    var rectangle2 = {
      position: { top: 50, left: 120 },
      size: { width: 100, height: 150 }
    };
    expect(new jashboard.IntersectionDetector().intersect(rectangle1, rectangle2)).toBeFalsy();
  });

  it("should detect intersection when the top left corwner of one rectangle is inside the other rectangle", function() {
    var rectangle1 = {
      position: { top: 0, left: 0 },
      size: { width: 100, height: 150 }
    };
    var rectangle2 = {
      position: { top: 50, left: 70 },
      size: { width: 100, height: 150 }
    };
    expect(new jashboard.IntersectionDetector().intersect(rectangle1, rectangle2)).toBeTruthy();
  });

  it("should detect intersection when the top right corner of one rectangle is inside the other rectangle", function() {
    var rectangle1 = {
      position: { top: 100, left: 200 },
      size: { width: 100, height: 150 }
    };
    var rectangle2 = {
      position: { top: 0, left: 170 },
      size: { width: 150, height: 150 }
    };
    expect(new jashboard.IntersectionDetector(10).intersect(rectangle1, rectangle2)).toBeTruthy();
  });

});