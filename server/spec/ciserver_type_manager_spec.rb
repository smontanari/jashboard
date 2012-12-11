require 'spec_helper'
require 'json_spec'
require 'plugins/build/build_monitor_adapter'
require 'plugins/build/ciserver_type_manager'

module Jashboard
  module Plugin
    module CIServer
      describe CIServerTypeManager do
        class DummyCIServerAdapter
        end

        it("should register the ci server type handler") do
          class DummyCIServerAdapter
            extend CIServerTypeManager
            is_ciserver_adapter_for_type 123
          end

          BuildMonitorAdapter.class_variable_get("@@ciserver_type_handlers")[123].should == DummyCIServerAdapter
        end
      end
    end
  end
end
