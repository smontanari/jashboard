require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module CIServer
      module GoAdapter
        def get_go_runtime_info(configuration)
          raise "Go build runtime info not supported"
        end
      end
    end
  end
end
