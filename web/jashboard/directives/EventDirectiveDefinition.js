jashboard.defineModule("jashboard.angular", function() {
  jashboard.angular.EventDirectiveDefinition = function(tagAttribute, actionCallbacks) {
    this.link = function(scope, element, attrs) {
      var actions = actionCallbacks(element);

      var events = scope.$eval(attrs[tagAttribute]);

      _.each(_.keys(events), function(key) {
        scope.$on(events[key], actions[key]);
      });
    };
  };
});