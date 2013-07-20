require 'plugins/plugin'

module Jashboard
  module Plugin
    module Vcs
      class VcsPlugin
        extend Plugin
        plugin_type 'vcs'
        monitor_type_adapters(GitAdapter)
      end
    end
  end
end

