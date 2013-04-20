require 'ipsum'
require 'plugins/plugin'
require 'plugins/ipsum/ipsum_runtime_info'

module Jashboard
  module Plugin
    module Ipsum
      class IpsumPlugin
        extend Plugin
        is_monitor_plugin_for_type 'ipsum'

        def get_runtime_info(monitor_configuration)
          IpsumRuntimeInfo.new(monitor_configuration[:number_of_sentences].sentences(monitor_configuration[:language].to_sym))
        end
      end
    end
  end
end
