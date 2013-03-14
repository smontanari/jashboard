describe("TooltipService", function() {
  var $stub, service, elementBinding;

  beforeEach(function() {
    elementBinding = jasmine.createSpyObj("elementBinding", ['bindElementAs', 'applyToElement']);
    spyOn(jashboard, "ElementBinding").andReturn(elementBinding);
    service = new jashboard.TooltipService();
    $stub = testHelper.stubJQuery("target-selector");
    $stub.tooltip = jasmine.createSpy("$.tooltip()");
  });

  it("shoul bind an element with a given key", function() {
    service.bindAs("test_selector", "test_key");
    
    expect(elementBinding.bindElementAs).toHaveBeenCalledWith("test_selector", "test_key");    
  });

  describe("attachTooltip()", function() {
    it("should create a simple text tooltip", function() {
      elementBinding.applyToElement = jasmine.createSpy().andCallFake(function(callback) {
        callback("target-selector", {});
      });
  
      service.attachTooltip("element_key", "test-content");

      expect(elementBinding.applyToElement).toHaveBeenCalledWith(jasmine.any(Function), "element_key");
      expect($stub.tooltip).toHaveBeenCalledWith({
        title: "test-content",
        container: "body"
      });
    });
  });

  describe("removeTooltip()", function() {
    it("should remove the tooltip", function() {
      elementBinding.applyToElement = jasmine.createSpy().andCallFake(function(callback) {
        callback("target-selector", {});
      });
      service.removeTooltip("element_key");
      expect(elementBinding.applyToElement).toHaveBeenCalledWith(jasmine.any(Function), "element_key");

      expect($stub.tooltip).toHaveBeenCalledWith('destroy');
    });
  });
});
