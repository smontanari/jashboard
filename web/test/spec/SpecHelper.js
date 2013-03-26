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
  module: jasmine.createSpy().andReturn(new MockModule())
}

var steal = {
  dev: jasmine.createSpyObj("steal.dev", ["log"])
};

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
  this.addMatchers({
    sinonStubToHaveBeenCalled: function() {
      if (arguments.length > 0) {
        throw new Error('sinonStubToHaveBeenCalled does not take arguments, use sinonStubToHaveBeenCalledWith');
      }
      this.message = function() {
        return [
          "Expected spy " + this.actual.displayName + " to not have been called.",
          "Expected spy " + this.actual.displayName + " to have been called."
        ];
      };
      return this.actual.called;
    },
    sinonStubToHaveBeenCalledWith: function() {
      this.message = function() {
        return calledWithArgumentsMessage.apply(this, arguments);
      };
      return this.actual.calledWith.apply(this.actual, arguments);
    },
    sinonStubToHaveBeenCalledInOrderWith: function() {
      var args = _.toArray(arguments);
      var order = _.first(args);
      var callArgs = _.rest(args, 1);
      this.message = function() {
        return calledWithArgumentsMessage.apply(this, callArgs);
      };
      var actualCall = this.actual.getCall(order);
      return actualCall.calledWith.apply(actualCall, callArgs);
    },
    toBeEmpty: function() {
      return _.isEmpty(this.actual);
    }
  });
});

