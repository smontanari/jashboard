require 'open-uri'
require 'nokogiri'
require 'extensions/jashboard_extensions'
require 'plugins/build/ciserver_type_manager'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module CIServer
      JenkinsServerConfiguration = Struct.new(:hostname, :port, :build_id).tap do |clazz|
        clazz.module_eval do
          extend ServerConfiguration
          ciserver_type 'jenkins'
        end
      end

      class JenkinsAdapter
        extend CIServerTypeManager
        is_ciserver_adapter_for_type 'jenkins'

        def create_configuration(input_configuration)
          JenkinsServerConfiguration.new(input_configuration['hostname'], input_configuration['port'], input_configuration['build_id'])
        end

        def fetch_build_runtime_info(configuration)
          @base_url = "http://#{configuration.hostname}:#{configuration.port}/job/#{configuration.build_id}"
          @doc = Nokogiri::XML(open("#{@base_url}/lastSuccessfulBuild/api/xml"))
          BuildRuntimeInfo.new(get_time, get_duration, get_result, get_current_status)
        end

        private

        def get_time
          seconds = @doc.at_css("timestamp").
                    text.
                    to_i / 1000
          Time.at(seconds).strftime("%d-%m-%Y %H:%M:%S")
        end

        def get_duration
          @doc.at_css("duration").
            text.
            to_i / 1000
        end

        def get_result
          @doc.at_css("result").text == "SUCCESS"
        end

        def get_current_status
          last_build_number = @doc.at_css("number").text.to_i
          status = nil
          begin
            open("#{@base_url}/#{last_build_number + 1}/api/xml")
            status = 1
          rescue OpenURI::HTTPError => error
            status = 0 if error.message.start_with? "404"
          rescue
          end
          status
        end
      end
    end
  end
end
