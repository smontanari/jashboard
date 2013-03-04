var MockModule = function() {
  this.value =
  this.factory =
  this.service =
  this.controller =
  this.directive =
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
  this.addMatchers({
  });
});

