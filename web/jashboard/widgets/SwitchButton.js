(function(module) {
  jashboard.widgets = _.extend(module, {
    SwitchButton: function(selector, initialState, onChangeFn) {
      var element = $(selector);
      var initButton = function(state) {
        element.bootstrapSwitch();
        element.bootstrapSwitch('setState', state);
        if (_.isFunction(onChangeFn)) {
          element.on('switch-change', onChangeFn);
        }
      };

      this.reset = function(state) {
        element.bootstrapSwitch('destroy');
        element.unbind('switch-change');
        initButton(state);
      };

      initButton(initialState || false);
    }
  });
}(jashboard.widgets || {}));
