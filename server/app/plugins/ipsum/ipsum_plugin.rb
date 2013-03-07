require 'plugins/plugin_manager'

module Jashboard
  module Plugin
    class IpsumMonitorPlugin
      extend PluginManager
      is_monitor_plugin_for_type 'ipsum'

      def get_configuration(input_configuration)
        Struct.new(:no_sentences, :language).new(
          input_configuration['no_sentences'], input_configuration['language']
        )
      end

      def get_runtime_info(monitor_configuration)
        monitor_configuration[:no_sentences].sentences(monitor_configuration[:language])
      end
    end
  end
end

