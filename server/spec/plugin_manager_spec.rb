require 'spec_helper'
require 'plugins/plugin_manager'

module Jashboard
  module Plugin
    module PluginManager
      describe PluginManager do
        before(:each) do
        end

        it("should register the type adapter") do
          class DummyHandler
            extend Plugin::PluginManager
            is_monitor_adapter_for_type "test_type"
          end
          handler = double
          DummyHandler.stub(:new => handler)

          PluginManager.adapter_for_type("test_type").should == handler
        end
      end
    end
  end
end
