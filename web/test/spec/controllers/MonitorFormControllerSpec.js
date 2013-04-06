describe("MonitorFormController", function() {
  var scope, controller, listener, formHelper, repository, pluginManager, monitorLayoutManager;
  beforeEach(function() {
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };    
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
    
    scope.$on.andCallFake(function(eventName, handler) {
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
      spyOn(jashboard, "MonitorFormHelper").andCallFake(function(form, model, handler) {
        saveMonitorCallback = handler;
        return {test: "formHelper"};
      });
      scope.baseMonitorForm = "baseMonitorForm";
      scope.baseMonitorData = {test: "test"};
    });

    describe("create mode", function() {
      var dashboard;
      beforeEach(function() {
        dashboard = {id: "test_dashboard", monitors: [{id: "m2"}]};
        listener({}, {
          mode: jashboard.inputOptions.createMode,
          parameters: {dashboard: dashboard}
        });
      });
      it("should put a new formHelper in the scope", function() {
        expect(jashboard.MonitorFormHelper).toHaveBeenCalledWith(scope.baseMonitorForm, scope.baseMonitorData, jasmine.any(Function));
        expect(scope.formHelper).toEqual({test: "formHelper"});
      });
      it("should reset the input variables in the scope", function() {
        // expect(scope.dashboard_id).toEqual("test_dashboard");
        expect(scope.baseMonitorData).toEqual({
          id: null,
          name: null,
          refreshInterval: null,
          type: "test_type1"
        });
      });
      it("should set the editMode variable as 'create' in the scope", function() {
        expect(scope.$editMode).toEqual(jashboard.inputOptions.createMode);
      });
      describe("save action callback", function() {
        var successHandler, errorHandler, adapter;
        beforeEach(function() {
          scope.baseMonitorData = {
            name: "test.name",
            refreshInterval: "123",
            type: "test_type2"
          };
          scope.monitorConfigurationFormModel = {
            test_type1: "testConfig1",
            test_type2: "testConfig2"
          };

          repository.createMonitor = jasmine.createSpy("repository.createMonitor()").andCallFake(function(dashboard_id, monitorParameters, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });
          adapter = {
            parseMonitorConfigurationForm: sinon.stub(),
            defaultSize: sinon.stub()
          };
          adapter.parseMonitorConfigurationForm.withArgs("testConfig2").returns("test_configuration_model");
          adapter.defaultSize.returns({width: 678, height: 654});
          pluginManager.findMonitorAdapter = sinon.stub();
          pluginManager.findMonitorAdapter.withArgs("test_type2").returns(adapter);
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
            scope.baseMonitorData = {
              name: "test.name",
              refreshInterval: "",
              type: "test_type2"
            };
            saveMonitorCallback();
            expect(repository.createMonitor.mostRecentCall.args[1].refreshInterval).toBeNaN();
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

    // describe("update mode", function() {
    //   var monitor;
    //   beforeEach(function() {
    //     monitor = {
    //       id: "test_monitor_id",
    //       name: "test_name",
    //       type: "test_type2",
    //       refreshInterval: 123,
    //       configuration: "test_configuration_data",
    //       runtimeInfo: "test_runtime_info"
    //     };
    //     listener({}, {
    //       mode: jashboard.inputOptions.updateMode,
    //       parameters: {monitor: monitor}
    //     });
    //   });
    //   it("should put a new formHelper in the scope", function() {
    //     expect(jashboard.MonitorFormHelper).toHaveBeenCalledWith(scope.baseMonitorForm, scope.baseMonitorData, jasmine.any(Function));
    //     expect(scope.formHelper).toEqual({test: "formHelper"});
    //   });
    //   it("should update the input variables in the scope", function() {
    //     expect(scope.dashboard_id).toBeNull();
    //     expect(scope.baseMonitorData).toEqual({
    //       id: "test_monitor_id",
    //       name: "test_name",
    //       type: "test_type2",
    //       refreshInterval: 123
    //     });
    //   });
    //   it("should set the editMode variable as 'update' in the scope", function() {
    //     expect(scope.editMode).toEqual(jashboard.inputOptions.updateMode);
    //   });

    //   describe("save action callback", function() {
    //     var successHandler, errorHandler, adapter;
    //     beforeEach(function() {
    //       repository.updateMonitorConfiguration = jasmine.createSpy("repository.updateMonitorConfiguration()").andCallFake(function(monitor_id, monitorParameters, handlers) {
    //         successHandler = handlers.success;
    //         errorHandler = handlers.error;
    //       });
    //       adapter = {
    //         parseMonitorConfigurationForm: sinon.stub(),
    //         convertMonitorConfigurationToData: sinon.stub()
    //       };
    //       adapter.parseMonitorConfigurationForm.withArgs("testConfig2").returns("test_configuration_model");
    //       adapter.convertMonitorConfigurationToData.withArgs("test_configuration_model").returns("test_new_configuration");
    //       pluginManager.findMonitorAdapter = sinon.stub();
    //       pluginManager.findMonitorAdapter.withArgs("test_type2").returns(adapter);

    //       scope.baseMonitorData = {
    //         id: "test_monitor_id",
    //         name: "test_new_name",
    //         refreshInterval: "456",
    //         type: "test_type2"
    //       };
    //       scope.monitorConfigurationFormModel = {
    //         test_type1: "testConfig1",
    //         test_type2: "testConfig2"
    //       };
    //     });
        
    //     describe("Form data evaluation", function() {
    //       it("should call the repository to update the monitor with parameters from the input form", function() {
    //         saveMonitorCallback();

    //         expect(repository.updateMonitorConfiguration).toHaveBeenCalledWith(
    //           "test_monitor_id", 
    //           {
    //             name: "test_new_name",
    //             refreshInterval: 456,
    //             configuration: "test_new_configuration"
    //           }, 
    //           jasmine.any(Object)
    //         );
    //       });
    //       it("should pass NaN for refreshInterval if not provided", function() {
    //         scope.baseMonitorData = {
    //           refreshInterval: "",
    //           type: "test_type2"
    //         };
    //         saveMonitorCallback();

    //         expect(repository.updateMonitorConfiguration.mostRecentCall.args[1].refreshInterval).toBeNaN();
    //       });
    //     });

    //     describe("Data model update", function() {
    //       it("should update the monitor", function() {
    //         saveMonitorCallback();

    //         successHandler(null);

    //         expect(monitor).toEqual({
    //           id: "test_monitor_id",
    //           name: "test_new_name",
    //           type: "test_type2",
    //           refreshInterval: 456,
    //           configuration: "test_configuration_model",
    //           runtimeInfo: "test_runtime_info"
    //         });
    //         expect(scope.$apply).toHaveBeenCalled();
    //       });
    //     });

    //     describe("Event handling", function() {
    //       beforeEach(function() {
    //         saveMonitorCallback();
    //       });
    //       it("should emit the 'MonitorSaveStart'", function() {
    //         expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveStart");
    //       });
    //       it("should emit the 'MonitorSaveComplete'", function() {
    //         successHandler(null);
            
    //         expect(scope.$emit).toHaveBeenCalledWith("MonitorSaveComplete");
    //       });
    //       it("should emit the 'CloseMonitorDialog'", function() {
    //         expect(scope.$emit).toHaveBeenCalledWith("CloseMonitorDialog");
    //       });
    //       it("should fire the 'AjaxError' event when failing to save the monitor", function() {
    //         errorHandler();

    //         expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    //       });
    //     });
    //   });
    // });
  });
});

