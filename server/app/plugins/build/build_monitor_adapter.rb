require 'plugins/plugin_manager'

module Jashboard
  module Plugin
    class BuildMonitorAdapter
      extend PluginManager
      is_monitor_plugin_for_type 'build'

      @@ciserver_type_handlers = {}

      def self.register_ciserver_type_handler(type, clazz)
        @@ciserver_type_handlers[type] = clazz
      end

      def get_configuration(input_configuration)
        clazz =  @@ciserver_type_handlers[input_configuration[:type]]
        clazz.new.create_configuration(input_configuration)
      end

      def get_runtime_info(monitor)
        clazz =  @@ciserver_type_handlers[monitor.configuration.type]
        clazz.new.fetch_build_runtime_info(monitor.configuration)
      end
    end
  end
end

