(function(module) {
  jashboard.widgets = _.extend(module, {
    SwitchButton: function(selector, onChangeFn) {
      var element = $(selector);
      var setState = function(state) {
        element.bootstrapSwitch('setState', state);
      };
            
      element.bootstrapSwitch();
      if (_.isFunction(onChangeFn)) {
        element.on('change', onChangeFn);
      }

      this.setOn = function() {
        setState(true);
      };
      this.setOff = function() {
        setState(false);
      };
    }
  });
}(jashboard.widgets || {}));
