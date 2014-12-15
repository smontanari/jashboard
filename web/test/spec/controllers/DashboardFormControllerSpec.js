describe("DashboardFormController", function() {
  var scope, controller, repository, eventListener;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
    scope.$on = jasmine.createSpy("scope.$on").and.callFake(function(eventName, handler) {
      if (eventName === "OpenDashboardDialog") eventListener = handler;
    });
    scope.dashboardForm = {};
    repository = {};

    controller = new jashboard.DashboardFormController(scope, repository);
  });

  describe("'OpenDashboardDialog' event in create mode", function() {
    beforeEach(function() {
      scope.dashboardFormModel = {id: "test", name: "test_name"};

      eventListener({}, {mode: jashboard.model.inputOptions.createMode});
    });

    it("should reset the dashboardFormModel variable in the scope", function() {
      expect(scope.dashboardFormModel).toEqual({});
    });
    it("should set the $editMode variable in the scope", function() {
      expect(scope.$editMode).toEqual(jashboard.model.inputOptions.createMode);
    });

    describe("saveDashboard()", function() {
      var successHandler, errorHandler;
      describe("creating a new dashboard", function() {
        beforeEach(function() {
          scope.dashboards = [{id: "some dashboard"}];
          scope.context = {};
          repository.createDashboard = jasmine.createSpy("repository.createDashboard()").and.callFake(function(input, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });

          scope.dashboardFormModel = {name: "test.name"};
        });

        describe("when the form is not valid", function() {
          beforeEach(function() {
            scope.dashboardForm = {isValid: false};
            scope.saveDashboard();
          });

          it("should not perform any action", function() {
            expect(scope.$emit).not.toHaveBeenCalled();
            expect(repository.createDashboard).not.toHaveBeenCalled();
          })
        });

        describe("when the form is valid", function() {
          beforeEach(function() {
            scope.dashboardForm = {isValid: true};
            scope.saveDashboard();
          });

          it("should emit the 'DashboardSaveStart'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveStart");
          });
          it("should emit the 'CloseDashboardDialog'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("CloseDashboardDialog");
          });
          it("should call the repository to create a dashboard", function() {
            expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Object));
          });
          it("should add the dashboard to the scope", function() {
            successHandler({id: "test.dashboard"});

            expect(scope.dashboards.length).toEqual(2);
            expect(scope.dashboards).toContain({id: "test.dashboard"});
            expect(scope.$apply).toHaveBeenCalled();
          });
          it("should set the current active dashboard", function() {
            successHandler({id: "test_dashboard"});

            expect(scope.context.activeDashboardId).toEqual("test_dashboard");
          });
          it("should emit the 'DashboardSaveComplete' if successful", function() {
            successHandler({id: "test_dashboard"});

            expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveComplete");
          });
          it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
            errorHandler();

            expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
          });
        });
      });
    });
  });

  describe("'OpenDashboardDialog' event in update mode", function() {
    beforeEach(function() {
      scope.dashboardFormModel = {};

      eventListener({}, {
        mode: jashboard.model.inputOptions.updateMode,
        parameters: {dashboard: {id: "test_dashboard_id", name: "test_dashboard_name", monitors: []}
      }});
    });

    it("should update the dashboardFormModel variable in the scope", function() {
      expect(scope.dashboardFormModel).toEqual({id: "test_dashboard_id", name: "test_dashboard_name"});
    });
    it("should set the $editMode variable in the scope", function() {
      expect(scope.$editMode).toEqual(jashboard.model.inputOptions.updateMode);
    });

    describe("saveDashboard()", function() {
      var successHandler, errorHandler;
      describe("updating a dashboard", function() {
        beforeEach(function() {
          scope.dashboards = [{id: "some dashboard", name: "some name"}, {id: "test.id", name: "test.name"}];
          repository.updateDashboard = jasmine.createSpy("repository.updateDashboard()").and.callFake(function(input, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });

          scope.dashboardFormModel = {id:"test.id", name: "test.another_name"};
        });

        describe("when the form is not valid", function() {
          beforeEach(function() {
            scope.dashboardForm = {isValid: false};
            scope.saveDashboard();
          });

          it("should not perform any action", function() {
            expect(scope.$emit).not.toHaveBeenCalled();
            expect(repository.updateDashboard).not.toHaveBeenCalled();
          })
        });

        describe("when the form is valid", function() {
          beforeEach(function() {
            scope.dashboardForm = {isValid: true};
            scope.saveDashboard();
          });

          it("should emit the 'DashboardSaveStart'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveStart");
          });
          it("should emit the 'CloseDashboardDialog'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("CloseDashboardDialog");
          });
          it("should call the repository to update a dashboard", function() {
            expect(repository.updateDashboard).toHaveBeenCalledWith({id:"test.id", name: "test.another_name"}, jasmine.any(Object));
          });
          it("should update the dashboard name if successful", function() {
            successHandler();

            expect(scope.dashboards[1]).toEqual({id:"test.id", name: "test.another_name"});
            expect(scope.$apply).toHaveBeenCalled();
          });
          it("should emit the 'DashboardSaveComplete' if successful", function() {
            successHandler({id: "test_dashboard"});

            expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveComplete");
          });
          it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
            errorHandler();

            expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
          });
        });
      });
    });
  });
});
