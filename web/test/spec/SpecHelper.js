var MockModule = function() {
  this.value =
  this.factory =
  this.service =
  this.controller =
  this.directive =
  this.run = function(){return this};
};

var jashboard = {
  model: {},
  application: new MockModule(),
  services: new MockModule(),
  plugin: {}
};
steal = {
  dev: jasmine.createSpyObj("steal.dev", ["log"])
};

var $, jQuery = function() {throw "you must stub or mock any call to jQuery!"};

var testHelper = {
  verifyObjectProperty: function(constructorfunc, testData) {
    var obj = new constructorfunc.prototype.constructor(testData.data);
    expect(obj[testData.property]).toEqual(testData.expectedValue);
  },
  stubJQuery: function(selectors) {
    var jQueryStub = sinon.stub();
    if (_.isArray(selectors)) {
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
  });
});

