(function(module) {
  jashboard.angular = _.extend(module, {
    EventDirectiveDefinition: function(tagAttribute, actionCallbacks) {
      this.link = function(scope, element, attrs) {
        var actions = actionCallbacks(scope, element, attrs);

        var eventsMap = scope.$eval(attrs[tagAttribute]);

        _.each(_.keys(eventsMap), function(actionName) {
          var events = eventsMap[actionName].split(',');
          _.each(events, function(eventName) {
            scope.$on(eventName, actions[actionName]);
          });
        });
      };
    }
  });
}(jashboard.angular || {}));
