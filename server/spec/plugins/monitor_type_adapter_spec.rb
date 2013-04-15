require 'spec_helper'
require 'plugins/monitor_type_adapter'

module Jashboard
  describe MonitorTypeAdapter do
    module DummyAdapter
      def get_dummy_runtime_info(config)
        Struct.new(:test_runtime).new(config.data)
      end
    end
    class MonitorTypeAdapter
      include DummyAdapter
    end

    it("should fetch and return build runtime info from the type adapter") do
      configuration = Struct.new(:type, :data).new("dummy", "test_data")
      runtime_info = subject.get_runtime_info(configuration)

      runtime_info.test_runtime.should == "test_data"
    end

    it("should raise an error if a type adapter is not defined") do
      expect { subject.get_runtime_info(Struct.new(:type, :data).new("not_defined", "test_data")) }.
        to raise_error("Type 'not_defined' not defined")
    end
  end
end
