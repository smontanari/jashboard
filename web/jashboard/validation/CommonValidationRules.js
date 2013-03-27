(function(module) {
  jashboard = _.extend(module, {
    CommonValidationRules: {
      required: function(value) {
        if (_.isEmpty(value)) {
          return {required: true};
        }
      },
      number: function(value) {
        if (!_.isEmpty(value) && !_.isFinite(parseInt(value, 10))) {
          return {number: true};
        }
      },
      positiveNumber: function(value) {
        if (parseInt(value, 10) <= 0) {
          return {positiveNumber: true};
        }
      }
    }
  });
}(jashboard || {}));
