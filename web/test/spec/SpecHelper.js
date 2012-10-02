var jashboard = {
  model: {},
  application: {
    controller: jasmine.createSpy()
  },
  testUtils: {
    verifyObjectProperty: function(constructorfunc, testData) {
      var obj = new constructorfunc.prototype.constructor(testData.data);
      expect(obj[testData.property]).toEqual(testData.expectedValue);
    }
  }
};

