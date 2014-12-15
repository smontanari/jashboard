describe("MonitorFormController", function() {
  var scope, controller, listener, formHelper, repository, pluginManager, monitorLayoutManager;
  beforeEach(function() {
    pluginManager = {
      monitorAdapters: {'test_type1': {}, 'test_type2': {}}
    };
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);

    scope.$on.and.callFake(function(eventName, handler) {
      listener = handler;
    });
    monitorLayoutManager = {
      nextAvailableMonitorPosition: sinon.stub()
    };
    repository = jasmine.createSpyObj("repository", ['createMonitor']);

    controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
  });

  it("should inject the array of available monitor types into the scope", function() {
    expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
  it("should initialise the monitorConfigurationFormModel object in the scope", function() {
    expect(scope.monitorConfigurationFormModel).toEqual({});
  });

  describe("'OpenMonitorDialog' event listener", function() {
    var saveMonitorCallback;
    beforeEach(function() {
      spyOn(jashboard, "MonitorFormHelper").and.callFake(function(form, model, handler) {
        saveMonitorCallback = handler;
        return {test: "formHelper"};
      });
      scope.baseMonitorForm = "baseMonitorForm";
      scope.monitorFormModel = {test: "test"};
    });

    describe("create mode", function() {
      var dashboard;
      beforeEach(function() {
        dashboard = {id: "test_dashboard", monitors: [{id: "m2"}]};
        listener({}, {
          mode: jashboard.model.inputOptions.createMode,
          parameters: {dashboard: dashboard}
        });
      });
      it("should put a new formHelper in the scope", function() {
        expect(jashboard.MonitorFormHelper).toHaveBeenCalledWith(scope.baseMonitorForm, scope.monitorFormModel, jasmine.any(Function));
        expect(scope.formHelper).toEqual({test: "formHelper"});
      });
      it("should reset the input variables in the scope", function() {
        expect(scope.monitorFormModel).toEqual({
          id: null,
          name: null,
          refreshInterval: null,
          type: "test_type1"
        });
      });
      it("should set the editMode variable as 'create' in the scope", function() {
        expect(scope.$editMode).toEqual(jashboard.model.inputOptions.createMode);
      });

      describe("save action callback", function() {
        var successHandler, errorHandler, adapter;
        beforeEach(function() {
          scope.monitorFormModel = {
            name: "test.name",
            refreshInterval: "123",
            type: "test_type2"
          };
          scope.monitorConfigurationFormModel = {
            test_type1: "testConfig1",
            test_type2: "testConfig2"
          };

          repository.createMonitor = jasmine.createSpy("repository.createMonitor()").and.callFake(function(dashboard_id, monitorParameters, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });
          adapter = {
            parseMonitorConfigurationForm: sinon.stub(),
            defaultSize: sinon.stub()
          };
          adapter.parseMonitorConfigurationForm.withArgs("testConfig2").returns("test_configuration_model");
          adapter.defaultSize.returns({width: 678, height: 654});
          pluginManager.monitorAdapters = {'test_type2': adapter};

          monitorLayoutManager.nextAvailableMonitorPosition.withArgs({id: "test_dashboard", monitors: [{id: "m2"}]}, {width: 678, height: 654})
              .returns({top: 123, left: 456});
        });

        describe("Form data evaluation", function() {
          it("should call the repository to create a monitor with parameters from the input form", function() {
            saveMonitorCallback();

            expect(repository.createMonitor).toHaveBeenCalledWith(
              "test_dashboard",
              {
                name: "test.name",
                type: "test_type2",
                refreshInterval: 123,
                position: {top: 123, left: 456},
                size: {width: 678, height: 654},
                configuration: "test_configuration_model"
              },
              jasmine.any(Object)
            );
          });
          it("should pass NaN for refreshInterval if not provided", function() {
            scope.monitorFormModel = {
              name: "test.name",
              refreshInterval: "",
              type: "test_type2"
            };
            saveMonitorCallback();
            expect(repository.createMonitor.calls.mostRecent().args[1].refreshInterval).toBeNaN();
          });
        });

        describe("Data model update", function() {
          it("should add the monitor to the dashboard", function() {
            saveMonitorCallback();

            successHandler("test.monitor");

            expect(dashboard.monitors.length).toEqual(2);
            expect(dashboard.monitors).toContain("test.monitor");
            expect(scope.$apply).toHaveBeenCalled();
          });
        });

        describe("Event handling", function() {
          beforeEach(function() {
            saveMonitorCallback();
          });
          it("should emit the 'MonitorSaveStart'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveStart");
          });
          it("should emit the 'MonitorSaveComplete'", function() {
            successHandler("test.monitor");

            expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveComplete");
          });
          it("should emit the 'CloseMonitorDialog'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("CloseMonitorDialog");
          });
          it("should fire the 'AjaxError' event when failing to save the monitor", function() {
            errorHandler();

            expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
          });
        });
      });
    });

    describe("update mode", function() {
      var monitor, adapter;
      beforeEach(function() {
        monitor = {
          id: "test_monitor_id",
          name: "test_name",
          type: "test_type2",
          refreshInterval: 123,
          configuration: "test_configuration",
          runtimeInfo: "test_runtime_info"
        };
        adapter = {
          parseMonitorConfigurationForm: sinon.stub(),
          convertMonitorConfigurationToFormModel: sinon.stub()
        };
        adapter.convertMonitorConfigurationToFormModel.withArgs("test_configuration").returns("test_configuration_model");
        pluginManager.monitorAdapters = {'test_type2': adapter};

        listener({}, {
          mode: jashboard.model.inputOptions.updateMode,
          parameters: {monitor: monitor}
        });
      });

      it("should set the editMode variable as 'update' in the scope", function() {
        expect(scope.$editMode).toEqual(jashboard.model.inputOptions.updateMode);
      });
      it("should update the input variables in the scope", function() {
        expect(scope.monitorFormModel).toEqual({
          id: "test_monitor_id",
          name: "test_name",
          type: "test_type2",
          refreshInterval: 123
        });
        expect(scope.monitorConfigurationFormModel.test_type2).toEqual("test_configuration_model");
      });
      it("should put a new formHelper in the scope", function() {
        expect(jashboard.MonitorFormHelper).toHaveBeenCalledWith(scope.baseMonitorForm, scope.monitorFormModel, jasmine.any(Function));
        expect(scope.formHelper).toEqual({test: "formHelper"});
      });

      describe("save action callback", function() {
        var successHandler, errorHandler;
        beforeEach(function() {
          repository.updateMonitorConfiguration = jasmine.createSpy("repository.updateMonitorConfiguration()").and.callFake(function(monitorModel, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });
          adapter.parseMonitorConfigurationForm.withArgs("testConfig2").returns("test_new_configuration");

          scope.monitorFormModel = {
            id: "test_monitor_id",
            name: "test_new_name",
            refreshInterval: "456",
            type: "test_type2"
          };
          scope.monitorConfigurationFormModel = {
            test_type1: "testConfig1",
            test_type2: "testConfig2"
          };
        });

        describe("Form data evaluation", function() {
          it("should call the repository to update the monitor with parameters from the input form", function() {
            saveMonitorCallback();

            expect(repository.updateMonitorConfiguration).toHaveBeenCalledWith(
              {
                id: "test_monitor_id",
                name: "test_new_name",
                refreshInterval: 456,
                type: "test_type2",
                configuration: "test_new_configuration"
              },
              jasmine.any(Object)
            );
          });
          it("should pass NaN for refreshInterval if not provided", function() {
            scope.monitorFormModel = {
              id: "test_monitor_id",
              name: "test_new_name",
              refreshInterval: "",
              type: "test_type2"
            };
            saveMonitorCallback();

            expect(repository.updateMonitorConfiguration.calls.mostRecent().args[0].refreshInterval).toBeNaN();
          });
        });

        describe("Data model update", function() {
          it("should update the monitor", function() {
            saveMonitorCallback();

            successHandler(null);

            expect(monitor).toEqual({
              id: "test_monitor_id",
              name: "test_new_name",
              type: "test_type2",
              refreshInterval: 456,
              configuration: "test_new_configuration",
              runtimeInfo: "test_runtime_info"
            });
            expect(scope.$apply).toHaveBeenCalled();
          });
        });

        describe("Event handling", function() {
          beforeEach(function() {
            saveMonitorCallback();
          });
          it("should emit the 'MonitorSaveStart'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveStart");
          });
          it("should emit the 'MonitorSaveComplete'", function() {
            successHandler(null);

            expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveComplete");
          });
          it("should emit the 'CloseMonitorDialog'", function() {
            expect(scope.$emit).toHaveBeenCalledWith("CloseMonitorDialog");
          });
          it("should fire the 'AjaxError' event when failing to save the monitor", function() {
            errorHandler();

            expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
          });
        });
      });
    });
  });
});

