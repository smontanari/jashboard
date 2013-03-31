(function(module) {
  jashboard = _.extend(module, {
    commonValidationRules: {
      noValidation: function(value) {
        return {};
      },
      required: function(value) {
        if (_.isEmpty(value)) {
          return {required: true};
        }
      },
      number: function(value) {
        if (!_.isEmpty(value) && !_.isFinite(value)) {
          return {number: true};
        }
      },
      positiveNumber: function(value) {
        if (parseInt(value, 10) <= 0) {
          return {positiveNumber: true};
        }
      },
      positiveInteger: function(value) {
        if (!_.isEmpty(value)) {
          var match = /^[1-9]\d*$/.exec(value);
          if (_.isNull(match)) {
            return {positiveInteger: true};
          }
        }
      }
    }
  });
}(jashboard || {}));
