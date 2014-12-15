var MockModule = function() {
  this.value =
  this.factory =
  this.service =
  this.controller =
  this.directive =
  this.config =
  this.run = function(){return this};
};
var angular = {
  module: jasmine.createSpy('angular.module()').and.returnValue(new MockModule())
}

var $, jQuery = function() {throw "you must stub or mock any call to jQuery!"};

var testHelper = {
  stubJQuery: function(selectors) {
    var jQueryStub = sinon.stub();
    if (_.isString(selectors)) {
      selectors = [selectors];
    }
    _.each(selectors, function(selector) {
      jQueryStub.withArgs(selector).returns(jQueryStub);
    });
    $ = jQuery = jQueryStub;
    return jQueryStub;
  },
  asyncTestRun: function(testRuns) {
    _.each(testRuns, function(testRun) {
      if (_.isFunction(testRun.before)) runs(testRun.before);

      if (_.isFunction(testRun.waitFor)) waitsFor(testRun.waitFor, "waitFor condition", 200);

      if (_.isFunction(testRun.after)) runs(testRun.after);
    });
  }
};

beforeEach(function() {
  var calledWithArgumentsMessage = function() {
    var expectedArgs = _.toArray(arguments);
    var invertedMessage = "Expected spy " + this.actual.displayName + " not to have been called with " + jasmine.pp(expectedArgs) + " but it was.";
    var positiveMessage = "";
    if (this.actual.callCount === 0) {
      positiveMessage = "Expected spy " + this.actual.displayName + " to have been called with " + jasmine.pp(expectedArgs) + " but it was never called.";
    } else {
      positiveMessage = "Expected spy " + this.actual.displayName + " to have been called with " + jasmine.pp(expectedArgs) + " but actual calls were " + jasmine.pp(this.actual.args).replace(/^\[ | \]$/g, '')
    }
    return [positiveMessage, invertedMessage];
  };
  jasmine.addMatchers({
    sinonStubToHaveBeenCalled: function(util, customEqualityTesters) {
      return {
        compare: function(actual) {
          if (arguments.length > 1) {
            throw new Error('sinonStubToHaveBeenCalled does not take arguments, use sinonStubToHaveBeenCalledWith');
          }
          var result = {
            pass: actual.called
          };
          if (result.pass) {
            result.message = "Expected spy " + actual + " to not have been called.";
          } else {
            result.message = "Expected spy " + actual + " to have been called.";
          }

          return result;
        }
      };
    },
    sinonStubToHaveBeenCalledWith: function(util, customEqualityTesters) {
      return {
        compare: function() {
          var args = _.toArray(arguments);
          var actual = _.first(args);
          var callArgs = _.rest(args, 1);
          var result = {
            pass: actual.calledWith.apply(actual, callArgs)
          };
          if (result.pass) {
            result.message = "Expected spy " + actual + " to not have been called with the given arguments.";
          } else {
            result.message = "Expected spy " + actual + " to have been called with the given arguments.";
          }

          return result;
        }
      };
    },
    sinonStubToHaveBeenCalledInOrderWith: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var args = _.toArray(arguments);
          var actual = _.first(args);
          var order = _.first(_.rest(args, 1));
          var callArgs = _.rest(args, 2);
          var actualCall = actual.getCall(order);
          var result = {
            pass: actualCall.calledWith.apply(actualCall, callArgs)
          };
          return result;
        }
      };
    },
    toBeEmpty: function(util, customEqualityTesters) {
      return {
        compare: function(actual) {
          return {
            pass: _.isEmpty(actual)
          }
        }
      };
    }
  });
});

