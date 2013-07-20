module Jashboard
  module Plugin
    class MonitorPluginDispatcher
      def initialize
        @plugins = {}
      end

      def register_adapter(type, clazz)
        @plugins[type] = clazz.new
      end

      def get_runtime_info(monitor)
        @plugins[monitor.type].get_runtime_info(monitor.configuration)
      end
    end
  end
end
