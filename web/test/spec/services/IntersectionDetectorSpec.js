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

  it("should detect intersection when the top left corner of one rectangle is inside the other rectangle", function() {
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
      position: { top: 130, left: 270 },
      size: { width: 250, height: 150 }
    };
    var rectangle2 = {
      position: { top: 15, left: 308 },
      size: { width: 270, height: 170 }
    };
    expect(new jashboard.IntersectionDetector().intersect(rectangle1, rectangle2)).toBeTruthy();
  });

});