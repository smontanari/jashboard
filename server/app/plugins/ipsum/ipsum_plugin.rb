require 'ipsum'
require 'plugins/plugin'
require 'plugins/ipsum/ipsum_runtime_info'

module Jashboard
  module Plugin
    module Ipsum
      class IpsumPlugin
        extend Plugin
        plugin_type 'ipsum'

        def get_runtime_info(monitor_configuration)
          text = monitor_configuration[:number_of_sentences].sentences(monitor_configuration[:language].to_sym)
          IpsumRuntimeInfo.new(text)
        end
      end
    end
  end
end
