require 'plugins/plugin'

module Jashboard
  module Plugin
    class Type1MonitorPlugin
      extend Plugin
      is_monitor_plugin_for_type 'type1'
    end
  end
end

