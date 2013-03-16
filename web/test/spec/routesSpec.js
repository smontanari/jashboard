describe("defineRoutes", function() {
  var routeProvider, locationProvider;
  beforeEach(function() {
    routeProvider = jasmine.createSpyObj("routeProvider", ['when']);
    locationProvider = jasmine.createSpyObj("locationProvider", ['html5Mode']);

    jashboard.defineRoutes(routeProvider, locationProvider);
  });

  it("should define the main page route", function() {
    expect(routeProvider.when).toHaveBeenCalledWith("/", {
      templateUrl: 'html/main_page_partial.html',
      controller: 'MainController'
    });
  });
  it("should define the about page route", function() {
    expect(routeProvider.when).toHaveBeenCalledWith("/about", {
      templateUrl: 'html/about_partial.html'
    });
  });
  it("should set the html5 mode", function() {
    expect(locationProvider.html5Mode).toHaveBeenCalledWith(false);
  });
});