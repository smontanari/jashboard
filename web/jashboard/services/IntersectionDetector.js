(function(module) {
  jashboard = _.extend(module, {
    IntersectionDetector: function() {
      var intersectsWith = function(rectangle) {
        var horizontalIntersection = rectangle.position.left <= (this.position.left) &&
          this.position.left < (rectangle.position.left + rectangle.size.width);
        var verticalIntersection = rectangle.position.top <= (this.position.top) &&
          this.position.top < (rectangle.position.top + rectangle.size.height);

        return horizontalIntersection && verticalIntersection;
      }
      this.intersect = function(rectangle1, rectangle2) {
        return intersectsWith.call(rectangle1, rectangle2) || intersectsWith.call(rectangle2, rectangle1);
      };
    }
  });
  jashboard.services.service('IntersectionDetector', [jashboard.IntersectionDetector]).run(function() {
    steal.dev.log("IntersectionDetector initialized");
  });
}(jashboard || {}));
