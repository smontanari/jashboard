describe("Jashboard utility functions", function() {
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

  describe("stringUtils", function() {
    it("should capitalise a given string", function() {
      var result = jashboard.stringUtils.capitalise("testString");

      expect(result).toEqual("TestString");
    });
    it("should return a truncated string with ellipsis", function() {
      var result = jashboard.stringUtils.ellipsis("test string longer than whatever", 23);

      expect(result).toEqual("test string longer than...");
    });
    it("should return the entire string with no ellipsis", function() {
      var result = jashboard.stringUtils.ellipsis("test string short", 20);

      expect(result).toEqual("test string short");
    });
  });

  describe("angularUtils", function() {
    var scope;
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$eval', '$apply']);
      scope.$root = {};
    });

    _.each(['$apply', '$digest'], function(phase) {
      it("should invoke $eval during a " + phase + " phase", function() {
        scope.$root.$$phase = phase;
        jashboard.angularUtils.safeApply(scope, "test_expression");

        expect(scope.$eval).toHaveBeenCalledWith("test_expression");
      });
    });
    it("should invoke $apply when not in $digest or $apply phase", function() {
      jashboard.angularUtils.safeApply(scope, "test_expression");

      expect(scope.$apply).toHaveBeenCalledWith("test_expression");
    });
  });

  describe("functionUtils", function() {
    var testFunction;
    beforeEach(function() {
      testFunction = jasmine.createSpy();
    });
    it("should execute the function if the condition is true", function() {
      jashboard.functionUtils.verify(true).then(testFunction);

      expect(testFunction).toHaveBeenCalled();
    });
    it("should not execute the function if the condition is false", function() {
      jashboard.functionUtils.verify(false).then(testFunction);

      expect(testFunction).not.toHaveBeenCalled();
    });
    it("should defer the condition check and execute a function if the condition is true", function() {
      jashboard.functionUtils.deferOnCondition(function() {return true;}, testFunction)();

      expect(testFunction).toHaveBeenCalled();
    });
    it("should defer the condition check and not execute a function if the condition is false", function() {
      jashboard.functionUtils.deferOnCondition(function() {return false;}, testFunction)();

      expect(testFunction).not.toHaveBeenCalled();
    });
  });
});
