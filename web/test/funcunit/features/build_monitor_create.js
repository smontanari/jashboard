funcunitHelper.testFeature("Build monitor create", "create_build_monitor", function() {
  var openMonitorDialog = function() {
    S("#dashboard_1-actions").click();
    S("#dashboard_1 .dashboard-actions a:contains('New Monitor')").visible("display new monitor menu action").click();
    S("#new-monitor-form").visible("show new monitor modal");
  };
  var inputMonitorData = function(data) {
    var monitorTypeConfigurationInput = {
      jenkins: function(data) {
        featureHelper.inputText("input[name='buildSettings-Jenkins-build_id']", data.build_id);
      },
      go: function(data) {
        featureHelper.inputText("input[name='buildSettings-go-pipeline']", data.pipeline);
        featureHelper.inputText("input[name='buildSettings-go-stage']", data.stage);
        featureHelper.inputText("input[name='buildSettings-go-job']", data.job);
      }
    };

    featureHelper.inputText("input[name='monitorName']", data.monitorName);
    featureHelper.inputText("input[name='monitorRefresh']", data.monitorRefresh);
    S("select[name='monitorType']").visible().click();
    S("select[name='monitorType'] option:contains('" + data.monitorType + "')").click();    
    S("#configuration-next").visible().click();
    featureHelper.inputText("input[name='serverName']", data.serverName);
    featureHelper.inputText("input[name='serverPort']", data.serverPort);
    S("#buildSettings-" + data.configurationType + "-tab").visible().click();
    monitorTypeConfigurationInput[data.configurationType](data);
  };

  test("should create a new jenkins build monitor", function() {
    openMonitorDialog();
    inputMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build",
      configurationType: "jenkins",
      serverName: "jenkins-server",
      serverPort: "1234",
      build_id: "jenkins-build-123"
    });

    S("#configuration-save").visible().click()

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        featureHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test jenkins-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
  test("should create a new go build monitor", function() {
    openMonitorDialog();
    inputMonitorData({
      monitorName: "Test go-monitor",
      monitorRefresh: "30",
      monitorType: "build",
      configurationType: "go",
      serverName: "go-server",
      serverPort: "1234",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    });

    S("#configuration-save").visible().click()

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        featureHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test go-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
});

