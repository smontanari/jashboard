require 'spec_helper'
require 'plugins/monitor_type_adapter'

module Jashboard
  module Plugin
    describe MonitorTypeAdapter do
      class DummyPlugin
        def get_dummy_runtime_info(config)
          Struct.new(:test_runtime).new(config.data)
        end
      end

      let(:obj) { DummyPlugin.new.extend MonitorTypeAdapter }
      
      it("should fetch and return build runtime info from the type adapter") do
        configuration = Struct.new(:type, :data).new("dummy", "test_data")
        runtime_info = obj.get_runtime_info(configuration)

        expect(runtime_info.test_runtime).to eq("test_data")
      end

      it("should raise an error if a type adapter is not defined") do
        expect { obj.get_runtime_info(Struct.new(:type, :data).new("not_defined", "test_data")) }.
          to raise_error("Type adapter 'not_defined' not defined")
      end
    end
  end
end
