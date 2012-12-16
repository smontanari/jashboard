require 'extensions/jashboard_extensions'
require 'plugins/build/ciserver_type_manager'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module CIServer
      GOServerConfiguration = Struct.new(:hostname, :port, :pipeline, :stage, :job).tap do |clazz|
        clazz.module_eval do
          extend ServerConfiguration
          ciserver_type "go"
        end
      end
      class GOAdapter
        extend CIServerTypeManager
        is_ciserver_adapter_for_type 'go'
      end
    end
  end
end
