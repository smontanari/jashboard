require 'ipsum'
require 'plugins/plugin'

module Jashboard
  module Plugin
    class IpsumPlugin
      extend Plugin
      is_monitor_adapter_for_type 'ipsum'

      def get_runtime_info(monitor_configuration)
        { text: monitor_configuration[:no_sentences].sentences(monitor_configuration[:language].to_sym) }
      end
    end
  end
end
