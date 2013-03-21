(function(module) {
  jashboard = _.extend(module, {
    MonitorPositioning: function() {
      var maxWidth = $(".container").width();
      var neighbourPosition = {
        right: function(monitor, requiredArea) {
          var leftOffset = monitor.position.left + monitor.size.width;
          if ((leftOffset + requiredArea.width) <= maxWidth) {
            return {top: monitor.position.top, left: leftOffset};
          }
        },
        left: function(monitor, requiredArea) {
          var leftOffset = monitor.position.left - requiredArea.width;
          if (leftOffset >= 0) {
            return { top: monitor.position.top, left: leftOffset };
          }
        },
        top: function(monitor, requiredArea) {
          var topOffset = monitor.position.top - requiredArea.height;
          var leftOffset = monitor.position.left + requiredArea.width;
          if (topOffset >= 0 && leftOffset <= maxWidth) {
            return { top: topOffset, left: monitor.position.left };
          }
        },
        bottom: function(monitor, requiredArea) {
          var topOffset = monitor.position.top + monitor.size.height;
          var leftOffset = monitor.position.left + requiredArea.width;
          if (leftOffset <= maxWidth) {
            return { top: topOffset, left: monitor.position.left };
          }
        }
      };

      this.neighbourPositions = function(monitor, requiredArea) {
        var availablePositions = [];
        _.each(['top', 'left', 'right', 'bottom'], function(side) {
          var candidatePosition = neighbourPosition[side](monitor, requiredArea);
          if (_.isObject(candidatePosition)) {
            availablePositions.push(candidatePosition);
          }
        });          
        return availablePositions;
      };
    }
  });
  jashboard.services.service('MonitorPositioning', [jashboard.MonitorPositioning]).run(function() {
    steal.dev.log("MonitorPositioning initialized");
  });
}(jashboard || {}));
