require 'spec_helper'
require 'json_spec'
require 'model/ciserver_settings'

module Jashboard
  module CIServer
    describe JenkinsServerSettings do
      it("should serialize to json") do
        JenkinsServerSettings.new("test.host.name", 40, "test-build-id").to_json.
          should be_json_eql %({"type": 1, "hostname": "test.host.name", "port": 40, "build_id": "test-build-id"})
      end
    end

    describe GOServerSettings do
      it("should serialize to json") do
        GOServerSettings.new("test.host.name", 40, "test-pipeline", "test-stage", "test-job").to_json.
          should be_json_eql %({"type": 2, "hostname": "test.host.name", "port": 40, "pipeline": "test-pipeline", "stage": "test-stage", "job": "test-job"})
      end
    end

    describe ServerSettingsFactory do
      it("should create an instance of JenkinsServerSettings") do
        settings = ServerSettingsFactory.get_settings({"type" => 1, "hostname" => "test.host", "port" => 123, "build_id" => "test-build"})

        settings.class.should == JenkinsServerSettings
        settings.hostname.should == "test.host"
        settings.port.should == 123
        settings.build_id.should == "test-build"
      end
      it("should create an instance of GOServerSettings") do
        settings = ServerSettingsFactory.get_settings({"type" => 2, "hostname" => "test.host", "port" => 123, "pipeline" => "test-pipeline", "stage" => "test-stage", "job" => "test-job"})

        settings.class.should == GOServerSettings
        settings.hostname.should == "test.host"
        settings.port.should == 123
        settings.pipeline.should == "test-pipeline"
        settings.stage.should == "test-stage"
        settings.job.should == "test-job"
      end
    end
  end
end
