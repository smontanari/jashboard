require 'plugins/ci/build_monitor_adapter'

module Jashboard
  module Plugin
    module CIServer
      module ServerSettings
        def ciserver_type(type)
          define_method :to_map do |*args|
            super(*args).tap do |map|
              map[:type] = type
            end
          end
        end
      end
      module CIServerTypeManager
        def is_ciserver_adapter_for_type(type)
          BuildMonitorAdapter.register_ciserver_type_handler(type, self)
        end
      end
    end
  end
end