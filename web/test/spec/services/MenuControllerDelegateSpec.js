describe("MenuControllerDelegate", function() {
  var delegate, scope;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$broadcast']);
    delegate = new jashboard.MenuControllerDelegate();
    delegate.init(scope);
  });

  describe("scope.menuAction()", function() {
    it("should broadcast the 'OpenDashboardDialog' event", function() {

      scope.menuAction('newDashboard');
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenDashboardDialog");      
    });
  });
});
