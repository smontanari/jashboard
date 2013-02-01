describe("Miscellaneous functions", function() {
  describe("timeConverter", function() {
    it("should convert a time duration of less than 10 minutes", function() {
      expect(jashboard.timeConverter.secondsToTime(122)).toEqual("02:02");
    });
    it("should convert a time duration longer than 10 minutes", function() {
      expect(jashboard.timeConverter.secondsToTime(752)).toEqual("12:32");
    });
    it("should convert a time duration longer than 1 hour", function() {
      expect(jashboard.timeConverter.secondsToTime(3632)).toEqual("01:00:32");
    });
    it("should convert a time duration longer than 2 hours", function() {
      expect(jashboard.timeConverter.secondsToTime(7952)).toEqual("02:12:32");
    });
  });

  describe("variableProcessor", function() {
    it("should return the alternative value if not defined", function() {
      var undefinedVariable;
      expect(jashboard.variableProcessor.validateData(undefinedVariable, "fallback value")).toEqual("fallback value");
    });
    it("should return the correct value if defined", function() {
      expect(jashboard.variableProcessor.validateData("some variable")).toEqual("some variable");
    });
    it("should invoke the passed function to convert the variable value", function() {
      var mockFunction = jasmine.createSpy("conversionFunction").andReturn("some value");

      var result = jashboard.variableProcessor.validateData("some variable", "", mockFunction);

      expect(mockFunction).toHaveBeenCalledWith("some variable");
      expect(result).toEqual("some value");
    });
  });

  describe("defineNamespace", function() {
    beforeEach(function() {
      testRootNamespace = undefined;
    });
    it("should create and populate a namespace", function() {
      jashboard.defineNamespace("testRootNamespace", function() {
        testRootNamespace.testValue = {};
      });

      expect(testRootNamespace.testValue).toBeDefined();
    });
    it("should create and populate the namespace recursively", function() {
      jashboard.defineNamespace("testRootNamespace.testChildNamespace", function() {
        testRootNamespace.testChildNamespace.testValue = {};
      });

      expect(testRootNamespace.testChildNamespace.testValue).toBeDefined();
    });
    it("should not re-create the namespace if already defined", function() {
      testRootNamespace = {
        testDefinedNamespace: {
          testDefinedValue: {}
        }
      };
      jashboard.defineNamespace("testRootNamespace.testDefinedNamespace.testChildNamespace", function() {
        testRootNamespace.testDefinedNamespace.testChildNamespace.testValue = {};
      });

      expect(testRootNamespace.testDefinedNamespace.testDefinedValue).toBeDefined();
      expect(testRootNamespace.testDefinedNamespace.testChildNamespace.testValue).toBeDefined();
    });
  });
});
