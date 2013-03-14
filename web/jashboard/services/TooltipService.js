(function(module) {
  jashboard = _.extend(module, {
    TooltipService: function() {
      var elementBinding = new jashboard.ElementBinding();

      this.bindAs = function(selector, key) {
        elementBinding.bindElementAs(selector, key);
      };

      this.attachTooltip = function(elementKey, text) {
        elementBinding.applyToElement(function(element, elementScope) {
          $(element).tooltip({
            title: text,
            container: "body"
          });
        }, elementKey);
      };
      this.removeTooltip = function(elementKey) {
        elementBinding.applyToElement(function(element, elementScope) {
          $(element).tooltip('destroy');
        }, elementKey);
      };
    }
  });
  jashboard.services.service('TooltipService', [jashboard.TooltipService]).run(function() {
    steal.dev.log("TooltipService initialized");
  });
}(jashboard || {}));
