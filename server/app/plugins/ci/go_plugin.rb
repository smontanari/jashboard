require 'extensions/jashboard_extensions'
require 'plugins/ci/ciserver_type_manager'
require 'plugins/ci/build_runtime_info'

module Jashboard
  module Plugin
    module CIServer
      GOServerSettings = Struct.new(:hostname, :port, :pipeline, :stage, :job).tap do |clazz|
        clazz.module_eval do
          extend ServerSettings
          ciserver_type 2
        end
      end
      class GOAdapter

      end
    end
  end
end
