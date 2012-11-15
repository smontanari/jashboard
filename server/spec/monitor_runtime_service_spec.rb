require 'spec_helper'
require 'model/ciserver_settings'
require 'model/runtime_info'
require 'service/monitor_runtime_service'
require 'service/adapters/ci/jenkins_adapter'
require 'service/adapters/ci/go_adapter'

module Jashboard
  describe MonitorRuntimeService do
    before(:each) do
      @adapter = double("ciserver adapter")
    end
    [
      {settings: CIServer::JenkinsServerSettings.new("test.host", 123, "test-build"), adapter: CIServer::JenkinsAdapter},
      {settings: CIServer::GOServerSettings.new("test.host", 456, "test-pipeline", "test-stage", "test-job"), adapter: CIServer::GOAdapter}
    ].each do |test_map|
      it("should fetch and return build runtime info from #{test_map[:adapter]}") do
        monitor = MonitorBuilder.as_build_monitor.
          with_id("test-id").
          with_name("test-name").
          with_refresh_interval(9038).
          with_ciserver_settings(test_map[:settings]).
          build
        test_map[:adapter].stub(:new).and_return(@adapter)
        runtime_info = Runtime::BuildRuntimeInfo.new("test.build-time", 345, false, 2)
        @adapter.should_receive(:fetch_build_info).with(test_map[:settings]).and_return(runtime_info)

        monitor_view = subject.get_monitor_runtime_info(monitor).should == runtime_info
      end
    end
  end
end
