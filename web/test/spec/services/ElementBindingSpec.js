describe("ElementBinding", function() {
  var binding, testFunction, scope = {id: "scopeId"};
  beforeEach(function() {
    angular.element = sinon.stub().withArgs("test-element").returns({
      scope: function() { return scope}
    });
    testFunction = jasmine.createSpy("testFunction");

    binding = new jashboard.ElementBinding();
  });

  it("should apply a function to the default element", function() {
    binding.bindDefaultElement("test-element");
    binding.applyToElement(testFunction);

    expect(testFunction).toHaveBeenCalledWith("test-element", scope);
  });

  it("should apply a function to the key element", function() {
    binding.bindElementAs("test-element1", "test-key1");
    binding.bindElementAs("test-element2", "test-key2");
    binding.applyToElement(testFunction, "test-key2");

    expect(testFunction).toHaveBeenCalledWith("test-element2", scope);
  });
});