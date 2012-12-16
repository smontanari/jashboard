require 'spec_helper'
require 'json_spec'
require 'open-uri'
require 'stringio'
require 'plugins/build/go_plugin'

module Jashboard
  module Plugin
    module CIServer
      describe GOServerConfiguration do
        it("should serialize to a json with type = 2") do
          GOServerConfiguration.new("test.host.name", 1234, "test-pipeline", "test-stage", "test-job").to_json.
            should be_json_eql %({
                "type": "go",
                "hostname": "test.host.name",
                "port": 1234,
                "pipeline": "test-pipeline",
                "stage": "test-stage",
                "job": "test-job"
            })
        end
      end
      describe GOAdapter do
        it("should register as ci server type handler for type 'go'") do
          BuildMonitorAdapter.class_variable_get('@@ciserver_type_handlers')['go'].should == GOAdapter
        end
      end
    end
  end
end