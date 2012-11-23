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

      it("should create the settings through the handler") do
        @handler.should_receive(:get_settings).with("test_settings").and_return("settings data")

        subject.get_settings(987, "test_settings").should == "settings data"
      end

      it("should retrieve the runtime data through the handler") do
        @handler.should_receive(:get_runtime_info).with("test_settings").and_return("runtime data")
        monitor = MonitorBuilder.new.
          with_type(987).
          with_settings("test_settings").
          build

        subject.get_runtime_info(monitor).should == "runtime data"
      end
    end
  end
end
