require 'spec_helper'
require 'plugins/ci/ciserver_type_manager'
require 'plugins/ci/build_monitor_adapter'

module Jashboard
  module Plugin
    describe BuildMonitorAdapter do
      class DummyHandler
        extend CIServer::CIServerTypeManager
        is_ciserver_adapter_for_type 123
      end

      it("should register as monitor type handler for type 1") do
        MonitorAdapter.class_variable_get('@@type_handlers')[1].should == BuildMonitorAdapter
      end

      it("should register a ciserver type handler") do
        BuildMonitorAdapter.class_variable_get('@@ciserver_type_handlers')[123].should == DummyHandler
      end

      it("should return the build settings from the type handler") do
        input_settings = Struct.new(:type).new(123)
        mock_handler = double
        DummyHandler.stub(:new => mock_handler)
        mock_settings = double
        mock_handler.should_receive(:create_settings).with(input_settings).and_return(mock_settings)

        subject.get_settings(input_settings).should == mock_settings

      end
      it("should fetch and return build runtime info from the type handler") do
        monitor_settings = Struct.new(:type).new(123)
        monitor = MonitorBuilder.new.
          with_id("test-id").
          with_settings(monitor_settings).
          build

        mock_handler = double
        DummyHandler.stub(:new => mock_handler)
        runtime_info = Object.new
        mock_handler.should_receive(:fetch_build_runtime_info).with(monitor_settings).and_return(runtime_info)

        subject.get_runtime_info(monitor).should === runtime_info
      end
    end
  end
end
