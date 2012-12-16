require 'spec_helper'
require 'plugins/build/ciserver_type_manager'
require 'plugins/build/build_monitor_adapter'

module Jashboard
  module Plugin
    describe BuildMonitorAdapter do
      class DummyHandler
        extend CIServer::CIServerTypeManager
        is_ciserver_adapter_for_type 123
      end

      it("should register as monitor type handler for type 'build'") do
        MonitorAdapter.class_variable_get('@@type_handlers')['build'].should == BuildMonitorAdapter
      end

      it("should register a ciserver type handler") do
        BuildMonitorAdapter.class_variable_get('@@ciserver_type_handlers')[123].should == DummyHandler
      end

      it("should return the build configuration from the type handler") do
        input_configuration = Struct.new(:type).new(123)
        mock_handler = double
        DummyHandler.stub(:new => mock_handler)
        mock_configuration = double
        mock_handler.should_receive(:create_configuration).with(input_configuration).and_return(mock_configuration)

        subject.get_configuration(input_configuration).should == mock_configuration

      end
      it("should fetch and return build runtime info from the type handler") do
        monitor_configuration = Struct.new(:type).new(123)
        monitor = MonitorBuilder.new.
          with_id("test-id").
          with_configuration(monitor_configuration).
          build

        mock_handler = double
        DummyHandler.stub(:new => mock_handler)
        runtime_info = Object.new
        mock_handler.should_receive(:fetch_build_runtime_info).with(monitor_configuration).and_return(runtime_info)

        subject.get_runtime_info(monitor).should === runtime_info
      end
    end
  end
end
