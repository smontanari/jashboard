require 'spec_helper'
require 'json_spec'
require 'model/build_monitor_view'
require 'model/ciserver_settings'
require 'model/runtime_info'
require 'monitor_builder'

module Jashboard
  describe BuildMonitorView do
    it("should represent the build monitor view as json") do
      monitor = MonitorBuilder.as_build_monitor.
        with_id("test.id").
        with_name("test.name").
        with_refresh_interval(123).
        with_ciserver_settings(CIServer::JenkinsServerSettings.new("test.host", 456, "test.build-id")).
        build

      build_runtime = Runtime::BuildInfo.new("test.build-time", 345, false, 2)

      expected_json = %({
        "id": "test.id",
        "name": "test.name",
        "type": 1,
        "refresh_interval": 123,
        "ciserver_settings": {
          "type": 1,
          "hostname": "test.host",
          "port": 456,
          "build_id": "test.build-id"
        },
        "runtime_info": {
          "last_build_time": "test.build-time",
          "duration": 345,
          "success": false,
          "status": 2
        }
      })

      BuildMonitorView.new(monitor, build_runtime).to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
