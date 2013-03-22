(function(module) {
  jashboard = _.extend(module, {
    TooltipService: function() {
      var elementBinding = new jashboard.ElementBinding();

      this.bindAs = function(selector, key) {
        elementBinding.bindElementAs(selector, key);
      };

      this.attachHtmlTooltip = function(elementKey, contentSelector) {
        elementBinding.applyToElement(function(element, elementScope) {
          $(element).tooltip({
            html: true,
            title: $(contentSelector).html(),
            container: "body"
          });
        }, elementKey);
      };
      this.removeTooltip = function(elementKey) {
        elementBinding.applyToElement(function(element, elementScope) {
          $(element).tooltip().tooltip('destroy');
        }, elementKey);
      };
    }
  });
  jashboard.services.service('TooltipService', [jashboard.TooltipService]).run(function() {
    steal.dev.log("TooltipService initialized");
  });
}(jashboard || {}));
