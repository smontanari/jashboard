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
  end
end
