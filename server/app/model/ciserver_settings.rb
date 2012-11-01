require 'extensions/jashboard_extensions'

module Jashboard
  module CIServer
    module ServerSettings
      def set_type(type)
        attr_reader :type
        define_method :initialize do |*args|
          super(*args)
          @type = type
        end
        define_method :to_map do |*args|
          super(*args).tap do |map|
            map[:type] = @type
          end
        end
      end
    end
    JenkinsServerSettings = Struct.new(:hostname, :port, :build_id).tap do |clazz|
      clazz.module_eval do
        extend ServerSettings
        set_type 1
      end
    end

    GOServerSettings = Struct.new(:hostname, :port, :pipeline, :stage, :job).tap do |clazz|
      clazz.module_eval do
        extend ServerSettings
        set_type 2
      end
    end
  end
end
