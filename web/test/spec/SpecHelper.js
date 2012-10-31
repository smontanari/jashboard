var MockModule = function() {
  this.value =
  this.factory =
  this.service =
  this.controller =
  this.run = function(){return this};
};
var jashboard = {
  model: {},
  application: new MockModule(),
  services: new MockModule()
};

var $, jQuery = function() {throw "you must stub or mock any call to jQuery!"};

var testHelper = {
  verifyObjectProperty: function(constructorfunc, testData) {
    var obj = new constructorfunc.prototype.constructor(testData.data);
    expect(obj[testData.property]).toEqual(testData.expectedValue);
  },
  stubJQuery: function(selectors) {
    var jQueryStub = sinon.stub();
    if (selectors) {
      _.each(selectors, function(selector) {
        jQueryStub.withArgs(selector).returns(jQueryStub);
      });
    }
    $ = jQuery = jQueryStub;
    return jQueryStub;
  }
};

beforeEach(function() {
  this.addMatchers({
    //toBeAStubThatHasBeenCalledWith: function(argMatcher) {
      //var errorMessage = "";
      //var success = true;
      //try{
        //sinon.assert.calledWith(this.actual, argMatcher);
      //} catch(e) {
        //errorMessage = e.message;
        //success = false;
      //}
      //this.message = function() {
        //return errorMessage;
      //};
      //return success;
    //},
    //toHaveBeenCalledWithAnArgumentThat: function(matcher) {
      //if (this.actual.calls.length == 0) {
        //this.message = "Expected " + this.actual + " to be called, but it wasn't";
        //return false;
      //}
      //if (this.actual.mostRecentCall.args.length == 0) {
        //this.message = "Expected " + this.actual + " to be called with an argument, but it was called with no arguments";
        //return false;
      //}
      //matcher(this.actual.args[0])

      //return success;
    //},
    //toHaveBeenPassedAnArgumentWith: function(idx, property, val) {
      //if (this.actual.calls.length === 0) {
        //this.message = "Expected to be called";
        //return false;
      //}
      //if (this.actual.mostRecentCall.args.length < idx+1) return false;
      //arg = this.actual.mostRecentCall.args[idx];
      //if (arg[property] === val) {
        //return true;
      //} else {
        //errorMessage = "Expected to be called with ";
        //return false;
      //}
    //}

  });
});

