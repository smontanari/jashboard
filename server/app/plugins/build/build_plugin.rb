require 'plugins/plugin'

module Jashboard
  module Plugin
    module Build
      class BuildPlugin
        extend Plugin
        plugin_type 'build'
        monitor_type_adapters(JenkinsAdapter, GoAdapter)
      end
    end
  end
end

