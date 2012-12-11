require 'spec_helper'
require 'json_spec'
require 'open-uri'
require 'stringio'
require 'plugins/build/go_plugin'

module Jashboard
  module Plugin
    module CIServer
      describe GOServerSettings do
        it("should serialize to a json with type = 2") do
          GOServerSettings.new("test.host.name", 1234, "test-pipeline", "test-stage", "test-job").to_json.
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
    end
  end
end