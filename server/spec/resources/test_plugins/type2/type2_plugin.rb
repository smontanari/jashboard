require 'plugins/plugin'

module Jashboard
  module Plugin
    class Type2MonitorPlugin
      extend Plugin
      is_monitor_plugin_for_type 'type2'
    end
  end
end

