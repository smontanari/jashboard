(function(module) {
  jashboard = _.extend(module, {
    ElementBinding: function() {
      var defaultSelector, selectors = {};

      this.bindDefaultElement = function(selector) {
        defaultSelector = selector;
      };

      this.bindElementAs = function(selector, key) {
        selectors[key] = selector;
      };

      this.applyToElement = function(fn, key) {
        var selector;
        if (_.isUndefined(key)) {
          selector = defaultSelector;
        } else {
          selector = selectors[key] || defaultSelector;
        }
        var elementScope = angular.element(selector).scope();
        fn(selector, elementScope);
      };
    }
  });
}(jashboard || {}));
