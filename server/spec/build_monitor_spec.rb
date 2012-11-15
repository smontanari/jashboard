require 'spec_helper'
require 'json_spec'
require 'model/build_monitor'
require 'model/ciserver_settings'

module Jashboard
  describe BuildMonitor do
    it("should represent the build monitor as json") do
      monitor = MonitorBuilder.as_build_monitor.
        with_id("test.id").
        with_name("test.name").
        with_refresh_interval(123).
        with_ciserver_settings(CIServer::JenkinsServerSettings.new("test.host", 456, "test.build-id")).
        build

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
        }
      })

      monitor.to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
