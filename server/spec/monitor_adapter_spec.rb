require 'spec_helper'
require 'plugins/plugin_manager'
require 'plugins/monitor_adapter'

module Jashboard
  module Plugin
    describe MonitorAdapter do
      class DummyHandler
        extend Plugin::PluginManager
        is_monitor_plugin_for_type 987
      end
      before(:each) do
        @handler = double
        DummyHandler.stub(:new => @handler)
      end

      it("should create the configuration through the handler") do
        @handler.should_receive(:get_configuration).with("test_configuration").and_return("configuration data")

        subject.get_configuration(987, "test_configuration").should == "configuration data"
      end

      it("should retrieve the runtime data through the handler") do
        @handler.should_receive(:get_runtime_info).with("test_configuration").and_return("runtime data")
        monitor = MonitorBuilder.new.
          with_type(987).
          with_configuration("test_configuration").
          build

        subject.get_runtime_info(monitor).should == "runtime data"
      end
    end
  end
end
